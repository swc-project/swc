function f(a) {
    if (null === void 0) return void 0 !== a.b && null !== a.b;
}
console.log(f({
    a: [
        null
    ],
    get b () {
        return this.a.shift();
    }
}));
