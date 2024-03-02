const readline = require("readline");
const fs = require("fs").promises;
const path = require("path");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
});


rl.on("line", async (data) => {
    try {
        data = data.replace('{ breakLength: Infinity, maxStringLength: Infinity }', '')
        const { name, source } = JSON.parse(data);
        const targetPath = path.join(
            __dirname,
            "..",
            "..",
            "tests",
            "fixture",
            "next",
            "raw",
            name.replace(".js", ""),
            "input.js"
        );

        await fs.mkdir(path.dirname(targetPath), { recursive: true });

        await fs.writeFile(targetPath, source, "utf8");
    } catch (e) {
        console.log(`Code: (${data})`);
        console.error(e);
    }
});
