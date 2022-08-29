//// [ts-expect-error-nocheck-js.ts]
//// [a.js]
// there should not be a "Unused @ts-expect-error" error since js files are not being checked
// @ts-expect-error
var a = 1;
