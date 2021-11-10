class Foo {
}
// @target: ES6
// @module: commonjs
// @filename: a.ts
export { Foo as default };
// @filename: b.ts
export default function foo() {
};
