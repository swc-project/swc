var o = {
    p: class Foo {
        constructor(value) {
            this.value = value * 10;
        }
    },
    x: 1,
    y: 2,
};
console.log(o.p.name, o.p === o.p, new o.p(o.x).value, new o.p(o.y).value);
