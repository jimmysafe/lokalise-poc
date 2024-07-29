import { env } from "../env";
import { lokaliseApi } from "../lokalize";

const branch_name = "feat/test-branch";

async function main() {
  const project_id = env.projectId;

  try {
    const res = await lokaliseApi
      .branches()
      .create({ name: branch_name }, { project_id: project_id });
    console.log(JSON.stringify(res, null, 2));
  } catch (err) {
    console.log(err);
  }
}

main();
