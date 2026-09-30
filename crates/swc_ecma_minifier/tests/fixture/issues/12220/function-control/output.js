function F() {
    return function G(target = new.target) {
        return target;
    };
}
var G = new F();
console.log(void 0 === G() && new G() === G);
