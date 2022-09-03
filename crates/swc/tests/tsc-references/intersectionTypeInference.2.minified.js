//// [intersectionTypeInference.ts]
function extend(obj1, obj2) {
    var result;
    return obj1 = result, obj2 = result, result = obj1, result = obj2;
}
var z, x = extend({
    a: "hello"
}, {
    b: 42
}), s = x.a, n = x.b;
function foo(obj) {}
var z = foo({
    a: "hello",
    b: 42
});
