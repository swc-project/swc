var a = 1;
var b = {
    get true() {
        return a;
    },
    set false(c) {
        a = c;
    },
};
console.log(b.true, (b.false = 2), b.true);
