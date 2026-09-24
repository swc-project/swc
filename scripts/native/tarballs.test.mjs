import test from "node:test";
import assert from "node:assert/strict";
import {
    mkdtempSync,
    mkdirSync,
    readFileSync,
    rmSync,
    writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { run } from "./common.mjs";
import { extractTarball, listTarball, tarMember } from "./tarballs.mjs";

test("tar reads archive bytes without interpreting drive letters or colons", () => {
    const root = mkdtempSync(join(tmpdir(), "swc archive 日本語 "));
    try {
        const contents = Buffer.from([0, 255, 13, 10, 42]);
        mkdirSync(join(root, "package"));
        writeFileSync(join(root, "package", "binding.node"), contents);
        const archive = join(
            root,
            process.platform === "win32"
                ? "archive with spaces.tgz"
                : "C: archive.tgz"
        );
        // The creation path also uses stdout so a colon is never a tar operand.
        writeFileSync(
            archive,
            run("tar", ["-czf", "-", "package"], { cwd: root, encoding: null })
        );
        assert(listTarball(archive).includes("package/binding.node"));
        assert.deepEqual(tarMember(archive, "binding.node"), contents);
        const output = join(root, "extracted 日本語");
        mkdirSync(output);
        extractTarball(archive, output);
        assert.deepEqual(readFileSync(join(output, "binding.node")), contents);
    } finally {
        rmSync(root, { recursive: true, force: true });
    }
});
