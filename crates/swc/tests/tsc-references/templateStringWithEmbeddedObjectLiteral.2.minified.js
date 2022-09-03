//// [templateStringWithEmbeddedObjectLiteral.ts]
var x = "abc".concat({
    x: 10,
    y: 20
}, "def");
