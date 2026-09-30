function F() {
    return function() {
        return class {
            [new.target === void 0 ? "field" : "wrongField"] = true;
            [new.target === void 0 ? "method" : "wrongMethod"]() {
                return true;
            }
        };
    }();
}
var C = new F();
console.log(new C().field && new C().method());
