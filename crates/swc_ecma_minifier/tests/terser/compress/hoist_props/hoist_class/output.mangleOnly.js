function n(n, e) {
    return new n(e).value;
}
var e = {
    p: class n {
        constructor(n) {
            this.value = n * 10;
        }
    },
    x: 1,
    y: 2,
};
console.log(e.p.name, e.p === e.p, n(e.p, e.x), n(e.p, e.y));
