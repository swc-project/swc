function a(a, b) {
    return new a(b).value;
}
var b = {
    p: class a {
        constructor(a){
            this.value = a * 10;
        }
    },
    x: 1,
    y: 2
};
console.log(b.p.name, b.p === b.p, a(b.p, b.x), a(b.p, b.y));
