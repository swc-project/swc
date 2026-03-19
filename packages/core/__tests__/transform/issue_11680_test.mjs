import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import swc from "../..";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixtureDir = path.join(__dirname, "..", "..", "tests", "issue-11680");
const fixtureEntry = path.join(fixtureDir, "src", "index.tsx");
const source = fs.readFileSync(fixtureEntry, "utf8");

function createOptions() {
    return {
        filename: path.join("src", "index.tsx"),
        cwd: fixtureDir,
        jsc: {
            parser: {
                syntax: "typescript",
                tsx: true,
            },
        },
    };
}

it("should resolve .swcrc using cwd for relative filenames", () => {
    const { code } = swc.transformSync(source, createOptions());

    expect(code).toContain("react/jsx-runtime");
});

it("should match explicit configFile output for the same relative input", () => {
    const automatic = swc.transformSync(source, createOptions());
    const explicit = swc.transformSync(source, {
        ...createOptions(),
        configFile: path.join(fixtureDir, ".swcrc"),
    });

    expect(automatic.code).toBe(explicit.code);
});
