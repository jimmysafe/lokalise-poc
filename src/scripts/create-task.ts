import { env } from "../env";

const frenchTranslatorsGroupId = "11720";
const spanishTranslatorsGroupId = "11719";

async function main() {
  const branch_name = "feat/test-branch";
  const project_id = env.projectId;

  try {
    const _res = await fetch(
      `https://api.lokalise.com/api2/projects/${project_id}:${branch_name}/tasks`,
      {
        method: "POST",
        body: JSON.stringify({
          title: "Test task",
          languages: [
            { language_iso: "es", groups: [spanishTranslatorsGroupId] },
          ],
        }),
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "X-Api-Token": env.lokalizeToken,
        },
      }
    );
    const res = await _res.json();
    console.log(JSON.stringify(res, null, 2));
  } catch (err) {
    console.log(err);
  }
}

main();
