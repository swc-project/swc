//// [jsDeclarationsClassMethod.js]
function C1() {
    this.prop = function(x, y) {
        return x + y;
    };
}
C1.prototype.method = function(x, y) {
    return x + y;
}, C1.staticProp = function(x, y) {
    return x + y;
};
class C2 {
    method1(x, y) {
        return x + y;
    }
}
C2.prototype.method2 = function(x, y) {
    return x + y;
}, C2.staticProp = function(x, y) {
    return x + y;
};
