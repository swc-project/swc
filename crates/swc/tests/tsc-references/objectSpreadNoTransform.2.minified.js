//// [objectSpreadNoTransform.ts]
var b, rest;
const o = {
    x: 1,
    ...{
        a: 'yes',
        b: 'no'
    }
};
({ b, ...rest } = o);
