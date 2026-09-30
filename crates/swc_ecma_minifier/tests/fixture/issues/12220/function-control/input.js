function F() {
    return (function() {
        return function G(target = new.target) {
            return target;
        };
    })();
}
var G = new F();
console.log(G() === undefined && new G() === G);
