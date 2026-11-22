function F() {
    return () => ({ x: "called" });
}

console.log(typeof (new F)());
console.log((new F)().x);
console.log(typeof (new F)?.());
console.log((new F)?.().x);
console.log(typeof new F()());

function G() {
    return function H(x) {
        return () => x;
    };
}

console.log(new new G()(22)());
console.log(new new G()(22)?.());
console.log(new (new G)(22)());
