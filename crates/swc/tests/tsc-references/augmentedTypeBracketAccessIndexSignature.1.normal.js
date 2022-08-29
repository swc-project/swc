//// [augmentedTypeBracketAccessIndexSignature.ts]
var a = {}[0]; // Should be Foo
var b = (function() {})[0]; // Should be Bar
