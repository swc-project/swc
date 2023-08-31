import os from "node:os";
import process from "node:process";
import childProcess from "child_process";
import { createRequire } from "node:module";

const localRequire = createRequire(`${process.cwd()}/[eval]`);

function getUniqueCpuNames(): string {
    return os
        .cpus()
        .map((cpu) => cpu.model)
        .filter((model, index, models) => models.indexOf(model) === index)
        .join(", ");
}

function getBinaryVersion(binaryName: string): string {
    try {
        return childProcess
            .execFileSync(binaryName, ["--version"])
            .toString()
            .trim();
    } catch {
        return "N/A";
    }
}

function getPackageVersion(packageName: string) {
    try {
        return localRequire(`${packageName}/package.json`).version;
    } catch {
        return null;
    }
}

function interestingPackage(name: string): string | null {
    const version = getPackageVersion(name);
    if (version) {
        return `${name}: ${version}`;
    } else {
        return null;
    }
}
function interestingPackages(names: string[]): string {
    return names.map(interestingPackage).filter(Boolean).join("\n        ");
}

console.log(`
    Operating System:
        Platform: ${os.platform()}
        Arch: ${os.arch()}
        Machine Type: ${os.machine()}
        Version: ${os.version()}
        CPU: (${os.cpus().length} cores)
            Models: ${getUniqueCpuNames()}

    Binaries:
        Node: ${process.versions.node}
        npm: ${getBinaryVersion("npm")}
        Yarn: ${getBinaryVersion("yarn")}
        pnpm: ${getBinaryVersion("pnpm")}

    Relevant Packages:
        @swc/core: ${getPackageVersion("@swc/core") ?? "N/A"}
        @swc/helpers: ${getPackageVersion("@swc/helpers") ?? "N/A"}
        @swc/types: ${getPackageVersion("@swc/types") ?? "N/A"}
        ${interestingPackages(["typescript", "next"])}

    SWC Config:
        output: N/A
        .swcrc path: N/A

    Next.js info:
        output: N/A
`);
