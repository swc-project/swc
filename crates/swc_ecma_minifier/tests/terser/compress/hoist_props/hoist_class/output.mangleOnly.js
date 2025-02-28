function e(n, e) {
    return new n(e).value;
}
var n = {
    p: class n {
        constructor(n){
            this.value = n * 10;
        }
    },
    x: 1,
    y: 2
};
console.log(n.p.name, n.p === n.p, e(n.p, n.x), e(n.p, n.y));
