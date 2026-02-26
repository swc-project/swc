import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const bindingSource = readFileSync(join(__dirname, "..", "binding.js"), "utf8");

it("should include linux ppc64 support in the native loader", () => {
    expect(bindingSource).toContain("process.arch === 'ppc64'");
    expect(bindingSource).toContain("@swc/core-linux-ppc64-gnu");
});

it("should include aix ppc64 support in the native loader", () => {
    expect(bindingSource).toContain("process.platform === 'aix'");
    expect(bindingSource).toContain("@swc/core-aix-ppc64");
});
