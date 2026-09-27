import test from "node:test";
import assert from "node:assert/strict";
import {
    mkdtempSync,
    mkdirSync,
    readFileSync,
    rmSync,
    statSync,
    writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { run } from "./common.mjs";
import { copyMeasurementAddon } from "./measurement-files.mjs";

test("measurement copies preserve bytes in distinct files", () => {
    const root = mkdtempSync(join(tmpdir(), "swc measurement 日本語 "));
    try {
        const source = join(root, "source.node");
        const destination = join(root, "copy.node");
        const bytes = Buffer.alloc(65536, 42);
        writeFileSync(source, bytes);
        copyMeasurementAddon(source, destination);
        assert.deepEqual(readFileSync(destination), bytes);
        assert.notEqual(statSync(source).ino, statSync(destination).ino);
    } finally {
        rmSync(root, { recursive: true, force: true });
    }
});

test(
    "Windows baselines clear inherited and source NTFS compression",
    {
        skip: process.platform !== "win32",
    },
    () => {
        const root = mkdtempSync(join(tmpdir(), "swc measurement 日本語 "));
        function compressed(path) {
            return (
                run(
                    "powershell.exe",
                    [
                        "-NoProfile",
                        "-NonInteractive",
                        "-Command",
                        "[bool]([IO.File]::GetAttributes($env:SWC_TEST_MEASUREMENT_PATH) -band [IO.FileAttributes]::Compressed)",
                    ],
                    { env: { ...process.env, SWC_TEST_MEASUREMENT_PATH: path } }
                ) === "True"
            );
        }
        try {
            const directory = join(root, "compressed");
            mkdirSync(directory);
            run("compact.exe", ["/C", "/F", "/Q", directory]);
            assert(compressed(directory));
            const source = join(directory, "source.node");
            const bytes = Buffer.alloc(65536, 42);
            writeFileSync(source, bytes);
            assert(compressed(source));
            for (const parent of [root, directory]) {
                const destination = join(parent, "copy.node");
                copyMeasurementAddon(source, destination);
                assert(!compressed(destination));
                assert.deepEqual(readFileSync(destination), bytes);
            }
            assert(compressed(source));
            assert(compressed(directory));
        } finally {
            rmSync(root, { recursive: true, force: true });
        }
    }
);
