function n(n) {
    if ({}.b === undefined || {}.b === null)
        return n.b !== undefined && n.b !== null;
}
console.log(
    n({
        a: [null],
        get b() {
            return this.a.shift();
        },
    })
);
