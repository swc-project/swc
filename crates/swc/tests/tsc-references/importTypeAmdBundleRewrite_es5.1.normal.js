// @declaration: true
// @module: amd
// @outFile: bundle.js
// @filename: a/b/c.ts
// @filename: a/inner.ts
var c = {
    x: 12
};
export { c };
// @filename: index.ts
var d = {
    x: 12
};
export { d };
