//// [objectSpreadNoTransform.ts]
var b, rest;
const y = {
    a: 'yes',
    b: 'no'
}, o = {
    x: 1,
    ...y
};
({ b , ...rest } = o);
