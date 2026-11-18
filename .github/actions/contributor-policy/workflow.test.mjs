import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { runInNewContext } from "node:vm";
import { parse } from "yaml";

const workflows = ["CI", "bench", "binary-size", "actions-security"];
const scenarios = JSON.parse(
  await readFile(
    new URL("fixtures/workflow-events.json", import.meta.url),
    "utf8"
  )
);
const workflow = async (name) =>
  parse(
    await readFile(
      new URL(`../../workflows/${name}.yml`, import.meta.url),
      "utf8"
    )
  );

/** Evaluate the workflow conditions, including GitHub's implicit success gate. */
function condition(expression, context) {
  if (
    !/\b(?:always|cancelled|success|failure)\s*\(/.test(expression) &&
    Object.values(context.needs).some((need) => need.result !== "success")
  )
    return false;
  const javascript = expression
    .replace(/^\s*\$\{\{/, "")
    .replace(/\}\}\s*$/, "")
    .replace(
      /needs\.\*\.result/g,
      "Object.values(needs).map(need => need.result)"
    )
    .replace(/needs\.([\w-]+)/g, 'needs["$1"]');
  return Boolean(
    runInNewContext(javascript, {
      ...context,
      cancelled: () => false,
      always: () => true,
      contains: (value, needle) => (value ?? "").includes(needle),
    })
  );
}

function contextFor(scenario, jobs = {}) {
  const context = {
    github: {
      event_name: scenario.eventName,
      event: { head_commit: { message: "update" } },
    },
    needs: Object.fromEntries(
      Object.keys(jobs).map((name) => [
        name,
        { result: scenario.run ? "success" : "skipped" },
      ])
    ),
  };
  context.needs["contributor-policy"] = {
    result: scenario.result,
    outputs: { allowed: scenario.allowed },
  };
  return context;
}

for (const name of workflows) {
  const document = await workflow(name);
  const gate = document.jobs["contributor-policy"];
  const roots = Object.entries(document.jobs).filter(
    ([jobName, job]) =>
      jobName !== "contributor-policy" &&
      dependencies(job).includes("contributor-policy") &&
      jobName !== "done"
  );

  test(`${name}: policy comes only from the default branch with a read-only token`, () => {
    assert.deepEqual(gate.permissions, { contents: "read" });
    assert.equal(gate.if, "github.event_name == 'pull_request'");
    const checkout = gate.steps.find((step) =>
      step.uses?.startsWith("actions/checkout@")
    );
    assert.equal(
      checkout.with.ref,
      "${{ github.event.repository.default_branch }}"
    );
    assert.equal(checkout.with.path, ".contributor-policy");
    assert.equal(checkout.with["persist-credentials"], false);
    assert(
      checkout.with["sparse-checkout"].includes("/.github/contributors.yml")
    );
    const action = gate.steps.find((step) => step.id === "policy");
    assert.equal(
      action.uses,
      "./.contributor-policy/.github/actions/contributor-policy"
    );
    assert.equal(action.with["close-untrusted"], undefined);
    assert.equal(gate.outputs.allowed, "${{ steps.policy.outputs.allowed }}");
  });

  test(`${name}: every workload depends on the policy`, () => {
    function reachesGate(jobName, seen = new Set()) {
      if (jobName === "contributor-policy") return true;
      assert(!seen.has(jobName), "Workflow dependency cycle");
      seen.add(jobName);
      return dependencies(document.jobs[jobName]).some((dependency) =>
        reachesGate(dependency, new Set(seen))
      );
    }
    assert(roots.length > 0);
    for (const jobName of Object.keys(document.jobs)) {
      if (jobName !== "done")
        assert(reachesGate(jobName), `${jobName} bypasses the policy`);
    }
  });

  for (const scenario of scenarios) {
    if (!(scenario.eventName in document.on)) continue;
    test(`${name}: workload conditions for ${scenario.name}`, () => {
      for (const [jobName, job] of roots) {
        assert.equal(
          condition(job.if, contextFor(scenario)),
          scenario.run,
          `${jobName} has an incorrect gate`
        );
      }
    });
  }
}

test("Done fails on a policy denial or error, including when workloads were skipped", async () => {
  const { jobs } = await workflow("CI");
  assert(dependencies(jobs.done).includes("contributor-policy"));
  assert(dependencies(jobs.done).includes("native-release-scripts"));
  for (const scenario of scenarios) {
    if (scenario.eventName === "workflow_dispatch") continue;
    const context = contextFor(scenario, jobs);
    assert.equal(
      condition(jobs.done.steps[0].if, context),
      scenario.fail,
      scenario.name
    );
  }
  const context = contextFor(scenarios[0], jobs);
  context.needs["cargo-test"].result = "failure";
  assert.equal(condition(jobs.done.steps[0].if, context), true);
});

test("benchmark chore pushes still skip the benchmark workload", async () => {
  const { jobs } = await workflow("bench");
  const context = contextFor(
    scenarios.find((scenario) => scenario.eventName === "push")
  );
  context.github.event.head_commit.message = "chore: update dependencies";
  assert.equal(condition(jobs["list-crates"].if, context), false);
});

const benchmarkScenarios = JSON.parse(
  await readFile(
    new URL("fixtures/benchmark-jobs.json", import.meta.url),
    "utf8"
  )
);
for (const scenario of benchmarkScenarios) {
  test(`benchmark matrix conditions for ${scenario.name}`, async () => {
    const { jobs } = await workflow("bench");
    // GitHub's implicit success gate also considers skipped policy ancestors.
    const context = {
      needs: {
        "contributor-policy": { result: scenario.policyResult },
        "list-crates": { result: scenario.listResult },
      },
    };
    assert.equal(
      condition(jobs["benchmark-crate"].if ?? "true", context),
      scenario.run
    );
  });
}

test("closure is serial, event-driven, and runs only trusted default-branch code", async () => {
  const document = await workflow("contributor-policy");
  assert.deepEqual(document.on, {
    pull_request_target: { types: ["opened", "reopened", "synchronize"] },
  });
  assert.equal(document.concurrency["cancel-in-progress"], false);
  assert(
    document.concurrency.group.includes("github.event.pull_request.number")
  );
  const job = document.jobs.enforce;
  assert.equal(job.if, "github.repository == 'swc-project/swc'");
  assert.deepEqual(job.permissions, {
    contents: "read",
    "pull-requests": "write",
  });
  assert.equal(
    job.steps[0].with.ref,
    "${{ github.event.repository.default_branch }}"
  );
  assert.equal(job.steps[0].with["persist-credentials"], false);
  assert.equal(job.steps[1].uses, "./.github/actions/contributor-policy");
  assert.equal(job.steps[1].with["close-untrusted"], "true");
});

test("policy tests use proposed code with no write permission and isolated dependencies", async () => {
  const { jobs, on } = await workflow("actions-security");
  for (const eventName of ["pull_request", "push"])
    assert(on[eventName].paths.includes(".github/contributors.yml"));
  const job = jobs["contributor-policy-tests"];
  assert.deepEqual(job.permissions, { contents: "read" });
  const steps = JSON.stringify(job.steps);
  assert(steps.includes("npm ci --ignore-scripts --no-audit --no-fund"));
  assert(!steps.includes("pnpm install"));
  assert(!steps.includes("pull_request_target"));
});

function dependencies(job) {
  return Array.isArray(job.needs) ? job.needs : job.needs ? [job.needs] : [];
}
