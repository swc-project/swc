const swc = require("../../");

it("should handle", async (done) => {
    const fs = require("fs");
    const path = require("path");

    async function* walk(dir) {
        for await (const d of await fs.promises.opendir(dir)) {
            const entry = path.join(dir, d.name);
            if (d.isDirectory()) yield* walk(entry);
            else if (d.isFile()) yield entry;
        }
    }

    // Then, use it with a simple async for loop
    async function main() {
        for await (const p of walk('./ecmascript/parser/')) {
            if (!p.endsWith('.ts') && !p.endsWith('.tsx')) {
                continue
            }
            console.log(p);
        }
    }

    await main()

    done()
});

