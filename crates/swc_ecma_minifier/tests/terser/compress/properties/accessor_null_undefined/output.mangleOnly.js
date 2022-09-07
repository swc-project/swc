var n = 1;
var e = {
    get null() {
        return n;
    },
    set undefined(e) {
        n = e;
    },
};
console.log(e.null, (e.undefined = 2), e.null);
