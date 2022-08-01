// @target: es5
// @importHelpers: true
// @isolatedModules: true
// @noTypesAndSymbols: true
// @noEmit: true
// @filename: main.ts
const k = [
    1,
    ,
    2
];
const o = [
    3,
    ...k,
    4
];
export { };
// @filename: tslib.d.ts
// this is a pre-TS4.4 versions of emit helper, which always forced array packing
