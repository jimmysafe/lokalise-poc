import { lokaliseApi } from "../lokalize";

async function main() {
  const res = await lokaliseApi.projects().list();
  console.log(JSON.stringify(res, null, 2));
}

main();
