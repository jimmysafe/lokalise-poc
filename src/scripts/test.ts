import { Lokalise } from "../lokalize";

const branch_name = "feat/process2";
const task_lang = "fr";

const api = new Lokalise();

async function crea_task() {
  const res = await api.createBranchTask(branch_name, task_lang);
  console.log(JSON.stringify(res, null, 2));
}
async function download_master_files() {
  const res = await api.download("master");
  console.log(JSON.stringify(res, null, 2));
}
async function download_branch_files() {
  const res = await api.download(branch_name);
  console.log(JSON.stringify(res, null, 2));
}
async function upload_files() {
  await api.upload(branch_name);
}
async function merge_branch() {
  const res = await api.mergeBranch({
    branch_name,
    target_branch_name: "master",
    delete_branch_after_merge: true,
  });
  console.log(JSON.stringify(res, null, 2));
}
async function create_branch() {
  const res = await api.createBranch(branch_name);
  console.log(JSON.stringify(res, null, 2));
}
async function get_task() {
  const res = await api.getBranchTasks(branch_name);
  console.log(JSON.stringify(res, null, 2));
}

async function getproject() {
  const res = await api.getProject();
  console.log(JSON.stringify(res, null, 2));
}
async function getprojectlangs() {
  const res = await api.getProjectLanguages();
  console.log(JSON.stringify(res, null, 2));
}

async function getBranchUpdatedKeys() {
  const res = await api.getUpdatedBranchKeys(branch_name);
  console.log(JSON.stringify(res, null, 2));
}

// !PR OPEN
async function openPR() {
  try {
    console.log("[CREATING BRANCH]");
    const branch = await api.createBranch(branch_name);
    console.log("[BRANCH CREATED]: ", branch.branch_id);
    console.log("[UPLOADING FILES]");
    const processes = await api.upload(branch_name);
    console.log("[PROCESSED FILES]: ", processes);

    console.log("[CHECKING PROCESS COMPLETION]");
    let allCompleted = false;
    do {
      allCompleted = true; // Assume all processes are completed
      for (const process of processes) {
        const p = await api.getUploadProcessStatus(process, branch_name);
        console.log(p.process_id, p.status);
        if (p?.status !== "finished") {
          allCompleted = false; // If any process is not finished, set to false
        }
      }
    } while (!allCompleted);

    console.log("[CREATING TASKS]");
    const task = await api.createBranchTask(branch_name, task_lang);
    console.log("[TASKS CREATED]: ", task?.task_id);
  } catch (err) {
    console.log(err);
  }
}

// openPR();
// getBranchUpdatedKeys();
// getprojectlangs();
// create_branch();
// upload_files();
// get_task();
// crea_task();
// merge_branch();
// download_master_files();
// download_branch_files();

// ******* SCENARIOS *******

//! OPEN PR
// - create branch
// - upload files
// - create task

//! CLOSE PR (merge into master)
// - merge branch
// - release S3

//! ROLLBACK
// - create branch (with fixed strings)
// - upload files
// - merge branch
// - release S3

api.master_files();
