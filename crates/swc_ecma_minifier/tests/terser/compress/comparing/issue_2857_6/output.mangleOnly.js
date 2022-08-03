function l(l) {
    if ({}.b === undefined || {}.b === null) return l.b !== undefined && l.b !== null;
}
console.log(l({
    a: [
        null
    ],
    get b () {
        return this.a.shift();
    }
}));
