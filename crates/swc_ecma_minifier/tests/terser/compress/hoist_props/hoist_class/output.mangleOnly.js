function n(n, p) {
    return new n(p).value;
}
var p = {
    p: class n {
        constructor(n){
            this.value = n * 10;
        }
    },
    x: 1,
    y: 2
};
console.log(p.p.name, p.p === p.p, n(p.p, p.x), n(p.p, p.y));
