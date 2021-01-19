function f1(obj) {
    var prop = "LiteralProperty";
    return !!-+obj[prop];
}
function f2(obj) {
    var prop1 = "One";
    var prop2 = "Two";
    return ~!!-+obj[prop1 + prop2];
}
