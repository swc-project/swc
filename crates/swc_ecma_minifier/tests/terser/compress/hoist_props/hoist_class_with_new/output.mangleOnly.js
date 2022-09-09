var e = {
    p: class e {
        constructor(e) {
            this.value = e * 10;
        }
    },
    x: 1,
    y: 2,
};
console.log(e.p.name, e.p === e.p, new e.p(e.x).value, new e.p(e.y).value);
