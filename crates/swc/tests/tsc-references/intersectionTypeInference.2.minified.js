//// [intersectionTypeInference.ts]
var x = function(obj1, obj2) {
    var result;
    return obj1 = result, obj2 = result, result = obj1, result = obj2;
}({
    a: "hello"
}, {
    b: 42
});
x.a, x.b;
