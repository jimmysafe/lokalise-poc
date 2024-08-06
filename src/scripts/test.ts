import { Lokalise } from "../lokalize";

const branch_name = "design";
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

getprojectlangs();
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
