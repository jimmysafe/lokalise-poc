import { env } from "../env";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";

const branch_name = "feat/test-branch";
const lang = "it";
const project_id = env.projectId;

async function uploadFile(filename: string, data: string) {
  try {
    const res = await fetch(
      `https://api.lokalise.com/api2/projects/${project_id}:${branch_name}/files/upload`,
      {
        method: "POST",
        body: JSON.stringify({
          format: "json",
          lang_iso: lang,
          data,
          filename,
        }),
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "X-Api-Token": env.lokalizeToken,
        },
      }
    );
    return res.json();
  } catch (err) {
    console.log(filename, err);
  }
}

async function main() {
  const __root = path.resolve();
  const directoryPath = path.join(__root, "locales", lang);

  try {
    const files = fs
      .readdirSync(directoryPath)
      .filter((file) => file.endsWith(".json"));

    //  Convert each JSON file to a Base64 string
    const base64Files = files.map((file) => {
      const filePath = path.join(directoryPath, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const base64Content = Buffer.from(fileContent).toString("base64");
      return { fileName: file, base64Content };
    });

    for (const file of base64Files) {
      const res = await uploadFile(file.fileName, file.base64Content);
      console.log(file.fileName, res);
    }
  } catch (error) {
    console.log(error);
  }
}

main();
