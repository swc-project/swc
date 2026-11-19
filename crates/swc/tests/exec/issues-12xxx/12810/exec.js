function F() {
    return () => ({ x: "called" });
}

console.log(typeof (new F)());
console.log((new F)().x);
console.log(typeof (new F)?.());
console.log((new F)?.().x);
console.log(typeof new F()());
