import { env } from "../env";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import unzipper from "unzipper";

// const branch_name = "master";
const branch_name = "feat/test-branch";

async function main() {
  const project_id = env.projectId;
  try {
    const _res = await fetch(
      `https://api.lokalise.com/api2/projects/${project_id}:${branch_name}/files/download`,
      {
        method: "POST",
        body: JSON.stringify({
          format: "json",
        }),
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "X-Api-Token": env.lokalizeToken,
        },
      }
    );
    const data = (await _res.json()) as any;
    const zipUrl = data.bundle_url;

    // Unzip downloaded files

    const __root = path.resolve();
    const __locales = path.join(__root, "locales");
    const __temp = path.join(__root, "temp");

    const zipResponse = await fetch(zipUrl);
    const zipBuffer = await zipResponse.buffer();

    fs.mkdirSync(__temp);
    const zipFilePath = path.join(__temp, "locales.zip");
    fs.writeFileSync(zipFilePath, zipBuffer);

    fs.createReadStream(zipFilePath)
      .pipe(unzipper.Extract({ path: __locales }))
      .on("close", () => {
        console.log("🚀 Unzipped successfully");
        fs.rmSync(__temp, { force: true, recursive: true }); // Clean up the zip file after extraction
      });
  } catch (error) {
    console.log(error);
  }
}

main();
