import os from "os";

console.log(`
    Operating System:
        Platform: ${os.platform()}} 
        Arch: ${os.arch()}
        Version: Darwin Kernel Version 22.5.0: Thu Jun  8 22:22:20 PDT 2023; root:xnu-8796.121.3~7/RELEASE_ARM64_T6000
    Binaries:
        Node: 18.16.0
        npm: 9.5.1
        Yarn: N/A
        pnpm: 8.6.3
    Relevant Packages:
        next: 13.4.12
        eslint-config-next: 13.0.5
        react: 18.2.0
        react-dom: 18.2.0
        typescript: 5.1.6
    Next.js Config:
        output: N/A
`);
