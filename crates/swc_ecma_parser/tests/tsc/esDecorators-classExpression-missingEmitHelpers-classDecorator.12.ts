// @target: es2022
// @importHelpers: true
// @module: commonjs
// @moduleResolution: classic
// @noTypesAndSymbols: true
// @filename: main.ts
export {};
declare var dec: any;

// uses __esDecorate, __runInitializers, __setFunctionName
function f(C = @dec class {}) {}

// @filename: tslib.d.ts
export {}
