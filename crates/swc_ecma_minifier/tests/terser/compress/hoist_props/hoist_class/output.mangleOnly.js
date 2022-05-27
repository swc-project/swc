function b(a, b) {
    return new a(b).value;
}
var a = {
    p: class a {
        constructor(a){
            this.value = a * 10;
        }
    },
    x: 1,
    y: 2
};
console.log(a.p.name, a.p === a.p, b(a.p, a.x), b(a.p, a.y));
