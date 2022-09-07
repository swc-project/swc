var e = 1;
var r = {
    get true() {
        return e;
    },
    set false(r) {
        e = r;
    },
};
console.log(r.true, (r.false = 2), r.true);
