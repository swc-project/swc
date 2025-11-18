//// [templateLiteralTypes6.ts]
// https://github.com/microsoft/TypeScript/issues/56659
function f2(scope, event) {
    f1(`${scope}:${event}`);
}
