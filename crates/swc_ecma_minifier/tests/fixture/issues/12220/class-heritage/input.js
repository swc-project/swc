function F() {
    return (function() {
        return class extends (new.target === undefined ? Array : Object) {};
    })();
}
var C = new F();
console.log(new C() instanceof Array);
