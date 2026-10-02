import { appendFile, readFile } from "node:fs/promises";
import { GitHubClient } from "./github.mjs";
import { runPolicy } from "./run.mjs";

try {
  const closeInput = process.env.POLICY_CLOSE_UNTRUSTED ?? "false";
  if (!["true", "false"].includes(closeInput)) {
    throw new Error("close-untrusted must be true or false");
  }
  const [event, source] = await Promise.all([
    readFile(process.env.GITHUB_EVENT_PATH, "utf8").then(JSON.parse),
    readFile(new URL("../../contributors.yml", import.meta.url), "utf8"),
  ]);
  const result = await runPolicy({
    eventName: process.env.GITHUB_EVENT_NAME,
    event,
    source,
    client: new GitHubClient({
      repository: process.env.GITHUB_REPOSITORY,
      token: process.env.POLICY_TOKEN,
      apiUrl: process.env.GITHUB_API_URL,
    }),
    closeUntrusted: closeInput === "true",
  });
  console.log(JSON.stringify({ operation: "contributor-policy", ...result }));
  await appendFile(process.env.GITHUB_OUTPUT, `allowed=${result.allowed}\n`);
} catch (error) {
  console.error(
    JSON.stringify({ operation: "contributor-policy", error: error.message })
  );
  process.exitCode = 1;
}
