import { env } from "../env";
import { lokaliseApi } from "../lokalize";

async function main() {
  const project_id = env.projectId;
  const branch_id_to_merge = 430953;
  const master_branch_id = 429134;
  try {
    const res = await lokaliseApi.branches().merge(
      branch_id_to_merge,
      { project_id },
      {
        target_branch_id: master_branch_id,
        force_conflict_resolve_using: "source", // feat branch changes will win.
      }
    );
    if (res.branch_merged) {
      await lokaliseApi.branches().delete(branch_id_to_merge, { project_id });
    }
    console.log(JSON.stringify(res, null, 2));
  } catch (err) {
    console.log(err);
  }
}

main();
