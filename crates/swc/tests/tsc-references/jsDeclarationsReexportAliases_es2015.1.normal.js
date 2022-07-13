// @allowJs: true
// @checkJs: true
// @target: es5
// @outDir: ./out
// @declaration: true
// @filename: cls.js
// @filename: usage.js
import { default as Fooa } from "./cls";
export default class Foo {
};
export const x = new Fooa();
export { default as Foob } from "./cls";
