import { env } from "../env";
import { lokaliseApi } from "../lokalize";

async function main() {
  const res = await lokaliseApi
    .userGroups()
    .list({ team_id: env.projectTeamId });
  console.log(JSON.stringify(res, null, 2));
}

main();
