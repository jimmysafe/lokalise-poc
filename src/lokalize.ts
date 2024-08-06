import {
  Branch,
  BranchMerged,
  CursorPaginatedResult,
  Key,
  Language,
  LokaliseApi,
  PaginatedResult,
  Project,
  QueuedProcess,
  Task,
  UserGroup,
} from "@lokalise/node-api";
import fs from "fs";
import path from "path";
import { env } from "./env";
import fetch from "node-fetch";
import unzipper from "unzipper";

export const lokaliseApi = new LokaliseApi({
  apiKey: env.lokalizeToken,
});

export class Lokalise {
  api: LokaliseApi;
  constructor() {
    this.api = new LokaliseApi({
      apiKey: env.lokalizeToken,
    });
  }

  async getUploadProcessStatus(
    process_id: string,
    branch_name: string
  ): Promise<QueuedProcess> {
    return this.api
      .queuedProcesses()
      .get(process_id, { project_id: `${env.projectId}:${branch_name}` });
  }

  async getProject(): Promise<Project> {
    return lokaliseApi.projects().get(env.projectId);
  }

  async getProjectUserGroups(): Promise<PaginatedResult<UserGroup>> {
    return lokaliseApi.userGroups().list({ team_id: env.projectTeamId });
  }

  async getProjectBranches(): Promise<PaginatedResult<Branch>> {
    return lokaliseApi.branches().list({ project_id: env.projectId });
  }

  async getProjectLanguages(): Promise<PaginatedResult<Language>> {
    return lokaliseApi.languages().list({ project_id: env.projectId });
  }

  async getBranchTasks(branch_name: string): Promise<PaginatedResult<Task>> {
    return lokaliseApi
      .tasks()
      .list({ project_id: `${env.projectId}:${branch_name}` });
  }

  async getProjectBranchByName(
    branch_name: string
  ): Promise<Branch | undefined> {
    const branches = await this.getProjectBranches();
    return branches.items.find((b) => b.name === branch_name);
  }

  async getLanguageUserTranslationGroup(lang: string) {
    const groups = await this.getProjectUserGroups();
    return groups.items.find((g) =>
      g.permissions.languages.find((l) => l.is_writable && l.lang_iso === lang)
    );
  }

  async getBranchKeys(
    branch_name: string
  ): Promise<CursorPaginatedResult<Key>> {
    return lokaliseApi.keys().list({
      project_id: `${env.projectId}:${branch_name}`,
      filter_tags: branch_name,
    });
  }

  async getUpdatedBranchKeys(branch_name: string): Promise<number[]> {
    console.log(`${env.projectId}:${branch_name}`);
    const res = await lokaliseApi.keys().list({
      project_id: `${env.projectId}:${branch_name}`,
      filter_tags: branch_name,
    });
    return res.items.map((key) => key.key_id);
  }

  async createBranchTask(
    branch_name: string,
    lang: string
  ): Promise<Task | null> {
    try {
      const group = await this.getLanguageUserTranslationGroup(lang);
      if (!group) throw new Error(`No user group found for ${lang}`);

      const keys = await this.getUpdatedBranchKeys(branch_name);
      return lokaliseApi.tasks().create(
        {
          title: `Update ${lang.toUpperCase()} - ${branch_name}`,
          keys,
          languages: [
            {
              language_iso: lang,
              groups: [group.group_id],
            },
          ],
        },
        { project_id: `${env.projectId}:${branch_name}` }
      );
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async createBranchTaskForAllLanguages(
    branch_name: string
  ): Promise<Task[] | null> {
    try {
      const langs = await this.getProjectLanguages();
      const tasks = await Promise.all(
        langs.items.map((lang) =>
          this.createBranchTask(branch_name, lang.lang_iso)
        )
      );
      return tasks.filter(Boolean) as Task[];
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async createBranch(branch_name: string): Promise<Branch> {
    return lokaliseApi
      .branches()
      .create({ name: branch_name }, { project_id: env.projectId });
  }

  async deleteBranch(branch_id: number): Promise<any> {
    return lokaliseApi
      .branches()
      .delete(branch_id, { project_id: env.projectId });
  }

  async mergeBranch({
    branch_name,
    target_branch_name,
    delete_branch_after_merge = false,
  }: {
    branch_name: string;
    target_branch_name: string;
    delete_branch_after_merge?: boolean;
  }): Promise<BranchMerged> {
    const branches = await this.getProjectBranches();
    const sourceBrance = branches.items.find((b) => b.name === branch_name);
    const targetBranch = branches.items.find(
      (b) => b.name === target_branch_name
    );
    if (!sourceBrance) throw new Error(`Branch ${branch_name} not found`);
    if (!targetBranch)
      throw new Error(`Branch ${target_branch_name} not found`);

    const res = await lokaliseApi.branches().merge(
      sourceBrance.branch_id,
      { project_id: env.projectId },
      {
        target_branch_id: targetBranch.branch_id,
        force_conflict_resolve_using: "source", // feat branch changes will win.,
      }
    );
    if (delete_branch_after_merge && res.branch_merged) {
      await this.deleteBranch(sourceBrance.branch_id);
    }
    return res;
  }

  async upload(branch_name: string): Promise<string[]> {
    try {
      const __root = path.resolve();
      const directoryPath = path.join(__root, "locales", "it");

      const files = fs
        .readdirSync(directoryPath)
        .filter((file) => file.endsWith(".json"));

      // Convert each JSON file to a Base64 string
      const base64Files = files.map((file) => {
        const filePath = path.join(directoryPath, file);
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const base64Content = Buffer.from(fileContent).toString("base64");
        return { fileName: file, base64Content };
      });

      let processes = [];
      for (const file of base64Files) {
        const res = await lokaliseApi
          .files()
          .upload(`${env.projectId}:${branch_name}`, {
            format: "json",
            lang_iso: "it",
            data: file.base64Content,
            filename: file.fileName,
            replace_modified: true,
            tags: [branch_name],
            cleanup_mode: true, // enables deleted keys to be removed from file
          });
        processes.push(res.process_id);
      }
      return processes;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async download(branch_name: string) {
    const res = await lokaliseApi
      .files()
      .download(`${env.projectId}:${branch_name}`, {
        format: "json",
        original_filenames: true,
        plural_format: "i18next",
        placeholder_format: "i18n",
        indentation: "4sp",
        export_sort: "first_added",
      });

    const zipUrl = res.bundle_url;
    const __root = path.resolve();
    const __locales = path.join(__root, "locales");
    const __temp = path.join(__root, "temp");

    const zipResponse = await fetch(zipUrl);
    const zipBuffer = await zipResponse.buffer();

    fs.mkdirSync(__temp);
    const zipFilePath = path.join(__temp, "locales.zip");
    fs.writeFileSync(zipFilePath, zipBuffer);

    fs.createReadStream(zipFilePath)
      .pipe(unzipper.Extract({ path: __locales }))
      .on("close", () => {
        console.log("🚀 Unzipped successfully");
        fs.rmSync(__temp, { force: true, recursive: true }); // Clean up the zip file after extraction
      });
  }
}
