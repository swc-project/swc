//// [objectSpreadNoTransform.ts]
var b, rest;
({ b , ...rest } = {
    x: 1,
    a: 'yes',
    b: 'no'
});
