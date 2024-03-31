function f(a) {
    if (true) return void 0 !== a.b && null !== a.b;
}
console.log(f({
    a: [
        null
    ],
    get b () {
        return this.a.shift();
    }
}));
