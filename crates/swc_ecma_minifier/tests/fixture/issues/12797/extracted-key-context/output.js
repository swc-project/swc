let hasPrivate, isStrict, isHeritageStrict;
// A computed key can use the private names of its class. Moving it out of the
// class would leave `#p` undeclared.
class C {
    #p;
    static set(x) {
        C.value = x;
    }
    [(hasPrivate = (obj)=>#p in obj, "method")]() {}
    static cache = console.log("init C");
}
// A function in a computed key is strict, because the class body is strict.
class D {
    static set(x) {
        D.value = x;
    }
    [(isStrict = function() {
        return void 0 === this;
    }, "method")]() {}
    static cache = console.log("init D");
}
// A function in the heritage expression is strict too.
class E extends (isHeritageStrict = function() {
    return void 0 === this;
}, Object) {
    static set(x) {
        E.value = x;
    }
    static cache = console.log("init E");
}
console.log(hasPrivate({}), isStrict(), isHeritageStrict());
