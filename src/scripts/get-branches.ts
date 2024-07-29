import { env } from "../env";
import { lokaliseApi } from "../lokalize";

async function main() {
  const res = await lokaliseApi.branches().list({ project_id: env.projectId });
  console.log(JSON.stringify(res, null, 2));
}

main();
