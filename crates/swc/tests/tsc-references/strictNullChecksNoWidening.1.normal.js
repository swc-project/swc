//// [strictNullChecksNoWidening.ts]
var a1 = null;
var a2 = undefined;
var a3 = void 0;
var b1 = [];
var b2 = [
    , 
];
var b3 = [
    undefined
];
var b4 = [
    [],
    []
];
var b5 = [
    [],
    [
        , 
    ]
];
var c1 = f(null);
var c2 = f(undefined);
var c3 = f([]);
