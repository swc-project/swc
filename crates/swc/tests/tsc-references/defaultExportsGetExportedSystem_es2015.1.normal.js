class Foo {
}
// @target: ES6
// @module: system
// @filename: a.ts
export { Foo as default };
// @filename: b.ts
export default function foo() {
};
