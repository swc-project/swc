import swc from "../..";
import { dirname, join } from "path";
import { platform } from "os";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

it("should transpile decorators", async () => {
    const filename = join(
        __dirname,
        "..",
        "..",
        "tests",
        "issue-4734",
        "1",
        "index.ts"
    );
    console.log(filename);
    const { code } = await swc.transformFile(filename, {});
    expect(code).toMatchInlineSnapshot(`
        "function _ts_decorate(decorators, target, key, desc) {
            var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
            if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
            else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
            return c > 3 && r && Object.defineProperty(target, key, r), r;
        }
        class TestClass {
            abc() {}
        }
        _ts_decorate([
            foo
        ], TestClass.prototype, "abc", null);
        function foo(target, propertyKey) {
            console.log(\`Decorating \${target}.\${String(propertyKey)}\`);
        }
        "
    `);
});
