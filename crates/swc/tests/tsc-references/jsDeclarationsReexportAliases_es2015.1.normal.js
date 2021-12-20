// @filename: usage.js
import { default as Fooa } from "./cls";
class Foo {
}
// @allowJs: true
// @checkJs: true
// @target: es5
// @outDir: ./out
// @declaration: true
// @filename: cls.js
export { Foo as default };
export const x = new Fooa();
export { default as Foob } from "./cls";
