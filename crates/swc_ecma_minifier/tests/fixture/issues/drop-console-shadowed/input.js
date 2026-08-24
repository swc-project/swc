function local() {
    const console = {
        log: (msg) => process.stdout.write(msg + "\n"),
    };
    console.log("kept");
}
local();
