import { env } from "../env";

async function main() {
  const branch_name = "feat/test-branch";
  const project_id = env.projectId;
  try {
    const _res = await fetch(
      `https://api.lokalise.com/api2/projects/${project_id}:${branch_name}/keys`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          "X-Api-Token": env.lokalizeToken,
        },
      }
    );
    const res = await _res.json();
    console.log(JSON.stringify(res, null, 2));
  } catch (error) {
    console.log(error);
  }
}

main();
