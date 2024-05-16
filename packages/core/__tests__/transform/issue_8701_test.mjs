import path from "node:path";
import { fileURLToPath } from "node:url";
import swc from "../..";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

it("should transpile import path correctly", async () => {
    const baseUrl = path.resolve(__dirname, "../../tests/issue-8701");
    console.log("baseUrl", baseUrl);
    process.chdir(baseUrl);

    const { code } = await swc.transformFile("src/app.module.ts", {
        jsc: {
            baseUrl,
            paths: {
                "@app/*": ["./src/*"],
            },
            parser: {
                syntax: "typescript",
                decorators: true,
            },
            target: "es2019",
        },
    });

    expect(code).toMatchInlineSnapshot(`
        "function _ts_decorate(decorators, target, key, desc) {
            var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
            if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
            else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
            return c > 3 && r && Object.defineProperty(target, key, r), r;
        }
        import { Module } from "@nestjs/common";
        import { AppController } from "./app.controller";
        import { AppService } from "./app.service";
        export class AppModule {
        }
        AppModule = _ts_decorate([
            Module({
                imports: [],
                controllers: [
                    AppController
                ],
                providers: [
                    AppService
                ]
            })
        ], AppModule);
        "
    `);
});
