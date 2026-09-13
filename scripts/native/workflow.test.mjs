import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parse } from "yaml";
import { join } from "node:path";
import { products, targets, minimumNodes } from "./targets.mjs";
import { repository, run } from "./common.mjs";

const workflow = parse(
    readFileSync(
        join(repository, ".github/workflows/publish-npm-package.yml"),
        "utf8"
    )
);
test("all products share a gate and publication cannot rebuild artifacts", () => {
    assert.deepEqual(workflow.jobs.build.strategy.matrix.package, products);
    assert.deepEqual(
        new Set(
            workflow.jobs.build.strategy.matrix.settings.map((s) => s.target)
        ),
        new Set(Object.keys(targets))
    );
    assert.deepEqual(workflow.jobs.publish.needs, ["verify-native-release"]);
    assert.deepEqual(workflow.jobs.assemble.needs, ["build"]);
    assert(
        workflow.jobs["verify-native-release"].needs.includes(
            "test-carrier-platform"
        )
    );
    const preparation = workflow.jobs.assemble.steps.find(
        (s) => s.name === "Prepare and verify npm tarballs"
    );
    assert(
        preparation.run.includes("env -u GITHUB_REPOSITORY"),
        "GitHub writes must wait for the gate"
    );
    const publication = JSON.stringify(workflow.jobs.publish);
    assert(publication.includes("scripts/native/publish.mjs"));
    assert(
        !publication.includes("prepack") &&
            !publication.includes("pnpm publish")
    );
    const parent = parse(
        readFileSync(join(repository, ".github/workflows/publish.yml"), "utf8")
    );
    for (const kind of ["nightly", "stable"]) {
        assert.equal(parent.jobs["publish-npm-" + kind].strategy, undefined);
        assert.equal(
            parent.jobs["publish-npm-" + kind].with.package,
            undefined
        );
    }
});
test("both build environments finish packing before the independent upload check", () => {
    const steps = workflow.jobs.build.steps;
    for (const name of ["Build", "Build in docker"]) {
        const step = steps.find((s) => s.name === name);
        assert(step.run.includes("scripts/native/finalize.mjs"));
        assert(step.run.includes('bash -e -o pipefail -lc "$BUILD_SCRIPT"'));
    }
    assert(
        steps
            .find((s) => s.name === "Build in docker")
            .run.includes("-e SOURCE_COMMIT")
    );
    const check = steps.findIndex(
        (s) => s.name === "Verify final upload bytes"
    );
    assert(check > steps.findIndex((s) => s.name === "Build"));
    assert(check < steps.findIndex((s) => s.name === "Upload artifact"));
    assert.equal(steps.find((s) => s.name === "Upload artifact").if, undefined);
});
test("selected targets have Node 20 and 22 product, tarball and timing paths", () => {
    const covered = new Set();
    for (const name of [
        "test-macOS-windows-binding",
        "test-linux-x64-gnu-binding",
        "test-linux-x64-musl-binding",
    ]) {
        const job = workflow.jobs[name];
        assert.deepEqual(job.strategy.matrix.package, products);
        assert.deepEqual(job.strategy.matrix.node, ["20", "22"]);
        assert.deepEqual(job.needs, ["assemble"]);
        assert(JSON.stringify(job).includes("scripts/native/runtime.mjs"));
        for (const setting of job.strategy.matrix.settings)
            covered.add(setting.target);
    }
    assert.deepEqual(
        covered,
        new Set(
            Object.keys(targets).filter((target) => targets[target].carrier)
        )
    );
    assert.deepEqual(
        workflow.jobs["test-minimum-binding"].strategy.matrix.settings,
        products.flatMap((product) =>
            minimumNodes[product].map((node) => ({ package: product, node }))
        )
    );
});
test("embedded bash build scripts remain syntactically valid", () => {
    for (const setting of workflow.jobs.build.strategy.matrix.settings) {
        run("bash", ["-n"], { input: setting.build });
    }
});
