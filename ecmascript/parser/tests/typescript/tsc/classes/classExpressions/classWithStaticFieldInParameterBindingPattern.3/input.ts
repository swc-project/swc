// @target: esnext
// @noTypesAndSymbols: true
// @noEmit: true
// @useDefineForClassFields: true

// https://github.com/microsoft/TypeScript/issues/36295
class C {}
(({ [class extends C { static x = 1 }.x]: b = "" }) => { var C; })();

const x = "";
(({ [class extends C { static x = 1 }.x]: b = "" }, d = x) => { var x; })();
