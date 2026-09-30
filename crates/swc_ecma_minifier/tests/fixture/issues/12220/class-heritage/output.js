function F() {
    return function() {
        return class extends (new.target === void 0 ? Array : Object) {
        };
    }();
}
var C = new F();
console.log(new C() instanceof Array);
