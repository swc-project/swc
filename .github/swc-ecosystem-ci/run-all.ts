import { getSuitesToRun, setupEnvironment } from "./utils.js";

async function runAll() {
  const { root } = await setupEnvironment();
  const suitesToRun = getSuitesToRun([], root);

  console.log(`::set-output name=suites::${JSON.stringify(suitesToRun)}`);
}

runAll();
