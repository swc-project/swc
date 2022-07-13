// @declaration: true
// @module: amd
// @outFile: bundle.js
// @filename: a/b/c.ts
// @filename: a/inner.ts
const c = {
    x: 12
};
export { c };
// @filename: index.ts
const d = {
    x: 12
};
export { d };
