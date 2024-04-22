//// [numericStringLiteralTypes.ts]
function f1(a, x) {
    var s = a[x]; // boolean
}
function f2(a, x) {
    var s = a[x]; // boolean
}
var container1 = createContainer('hi');
var container2 = createContainer(2);
f([
    container1,
    container2
], function(value1, value2) {
    value1; // string
    value2; // number
});
