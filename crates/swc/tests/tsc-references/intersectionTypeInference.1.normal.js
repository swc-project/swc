//// [intersectionTypeInference.ts]
function extend(obj1, obj2) {
    var result;
    obj1 = result;
    obj2 = result;
    result = obj1; // Error
    result = obj2; // Error
    return result;
}
var x = extend({
    a: "hello"
}, {
    b: 42
});
var s = x.a;
var n = x.b;
function foo(obj) {
    return undefined;
}
var z = foo({
    a: "hello",
    b: 42
});
var z;
