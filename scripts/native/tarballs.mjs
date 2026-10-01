import assert from "node:assert/strict";
import { closeSync, openSync, readFileSync } from "node:fs";
import { run, sha512 } from "./common.mjs";

// GNU tar treats a Windows drive letter in -f as a remote host. A stdin file
// handle avoids path translation and the EPIPE race when BSD tar finishes a
// member before Node has written the whole archive to a pipe. These operations
// are outside loading timers. Always close our copy of the handle after tar.
function readTarball(file, args, options = {}) {
    const input = openSync(file, "r");
    try {
        return run("tar", args, { ...options, stdio: [input, "pipe", "pipe"] });
    } finally {
        closeSync(input);
    }
}

export function listTarball(file) {
    return readTarball(file, ["-tzf", "-"]).split("\n").filter(Boolean);
}

export function extractTarball(file, directory) {
    return readTarball(file, ["-xzf", "-", "--strip-components=1"], {
        cwd: directory,
    });
}

/** Read tar members without extracting untrusted paths or running lifecycle scripts. */
export function tarMember(file, name) {
    return readTarball(file, ["-xzOf", "-", "package/" + name], {
        encoding: null,
        maxBuffer: 512 * 1024 * 1024,
    });
}

export function inspectTarball(file, manifest, report) {
    const names = listTarball(file);
    for (const name of names) {
        assert(
            name.startsWith("package/") &&
                !name.split("/").includes("..") &&
                !name.includes("\\"),
            "unsafe tar member"
        );
        assert(
            !/\.(swcn|raw|tmp)$|native-reports|native-carrier-/.test(name),
            "carrier sidecar in npm package"
        );
    }
    const packed = JSON.parse(tarMember(file, "package.json"));
    for (const field of [
        "name",
        "version",
        "main",
        "engines",
        "os",
        "cpu",
        "libc",
        "files",
        "optionalDependencies",
    ]) {
        assert.deepEqual(
            packed[field],
            manifest[field],
            "npm contract changed: " + field
        );
    }
    const addons = names.filter((name) => name.endsWith(".node"));
    if (report) {
        assert.deepEqual(
            addons,
            ["package/" + report.filename],
            "unexpected npm addon layout"
        );
        const bytes = tarMember(file, report.filename);
        assert.equal(
            bytes.length,
            report.kind === "carrier" ? report.carrierSize : report.rawSize
        );
        assert.equal(
            sha512(bytes),
            report.kind === "carrier" ? report.carrierSha512 : report.rawSha512
        );
        for (const name of ["swc", "swc.exe"]) {
            if (names.includes("package/" + name)) {
                assert.equal(
                    sha512(tarMember(file, name)),
                    report.cli[name],
                    "unexpected or changed packaged CLI"
                );
            }
        }
    } else {
        assert.deepEqual(
            addons,
            [],
            "main package must resolve its native optional dependency"
        );
    }
    return {
        size: readFileSync(file).length,
        sha512: sha512(readFileSync(file)),
        manifest: packed,
    };
}
