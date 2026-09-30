function F() {
    return (function() {
        return class {
            [new.target === undefined ? "field" : "wrongField"] = true;
            [new.target === undefined ? "method" : "wrongMethod"]() { return true; }
        };
    })();
}
var C = new F();
console.log(new C().field && new C().method());
