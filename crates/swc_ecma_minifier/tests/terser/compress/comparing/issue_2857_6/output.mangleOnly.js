function a(a) {
    if ({}.b === undefined || {}.b === null) return a.b !== undefined && a.b !== null;
}
console.log(a({
    a: [
        null
    ],
    get b () {
        return this.a.shift();
    }
}));
