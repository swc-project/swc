import os from "node:os";
import process from "node:process";

function getUniqueCpuNames(): string {
    return os
        .cpus()
        .map((cpu) => cpu.model)
        .filter((model, index, models) => models.indexOf(model) === index)
        .join(", ");
}

console.log(`
    Operating System:
        Platform: ${os.platform()}
        Arch: ${os.arch()}
        Machine Type: ${os.machine()}
        Version: ${os.release()}
        CPU: (${os.cpus().length} cores)
            Models: ${getUniqueCpuNames()}

    Binaries:
        Node: ${process.version}
        npm: 9.5.1
        Yarn: N/A
        pnpm: 8.6.3
    Relevant Packages:
        next: 13.4.12
        eslint-config-next: 13.0.5
        react: 18.2.0
        react-dom: 18.2.0
        typescript: 5.1.6

    SWC Config:
        output: N/A
        .swcrc path: N/A

    Next.js info:
        output: N/A
`);
