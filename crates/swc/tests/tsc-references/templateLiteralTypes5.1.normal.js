//// [templateLiteralTypes5.ts]
// https://github.com/microsoft/TypeScript/issues/55364
const f1 = f;
const f2 = f;
function f3(x) {
    const test1 = x;
    const test2 = "";
}
