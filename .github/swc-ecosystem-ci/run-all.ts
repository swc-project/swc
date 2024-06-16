import { Octokit } from "octokit";
import { getSuitesToRun, setupEnvironment } from "./utils";

async function runAll() {
  const { root } = await setupEnvironment();
  const suitesToRun = getSuitesToRun([], root);

  const octokit = new Octokit({ auth: process.env.BOT_GH_TOKEN! });

  console.log(await octokit.rest.users.getAuthenticated());

  await octokit.rest.actions.createWorkflowDispatch({
    owner: "swc-project",
    repo: "swc-ecosystem-ci",
    workflow_id: "72388640",
    ref: "main",
    inputs: {
      suites: JSON.stringify(suitesToRun),
      mode: process.env.CI_MODE!,
      version: process.env.SWC_VERSION!,
    },
  });
}

runAll();
