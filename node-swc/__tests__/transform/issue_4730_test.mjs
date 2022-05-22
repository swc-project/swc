import swc from "../../..";
import { dirname, join } from "path";
import { platform } from "os";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

it("should work", async () => {
    const filename = join(
        __dirname,
        "..",
        "..",
        "tests",
        "issue-4730",
        "src",
        "index.ts"
    );
    console.log(filename);
    const { code } = await swc.transformFile(filename, {
        "jsc": {
            "parser": {
                "syntax": "typescript",
                "dynamicImport": true
            },
            "target": "es2020",
            "paths": {
                "@print/a": [
                    join(process.cwd(), "./packages/a/src/index.ts")
                ],
                "@print/b": [
                    join(process.cwd(), "./packages/b/src/index.ts")
                ]
            }
        },
        "module": {
            "type": "commonjs"
        }
    });
    expect(code).toMatchInlineSnapshot(`
        "var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
            var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
            if (typeof Reflect === \\"object\\" && typeof Reflect.decorate === \\"function\\") r = Reflect.decorate(decorators, target, key, desc);
            else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
            return c > 3 && r && Object.defineProperty(target, key, r), r;
        };
        class TestClass {
            abc() {}
        }
        __decorate([
            foo
        ], TestClass.prototype, \\"abc\\", null);
        function foo(target, propertyKey) {
            console.log(\`Decorating \${target}.\${String(propertyKey)}\`);
        }
        "
    `);
});
