function run(c, v) {
    return new c(v).value;
}
var o = {
    p: class Foo {
        constructor(value) {
            this.value = value * 10;
        }
    },
    x: 1,
    y: 2,
};
console.log(o.p.name, o.p === o.p, run(o.p, o.x), run(o.p, o.y));
