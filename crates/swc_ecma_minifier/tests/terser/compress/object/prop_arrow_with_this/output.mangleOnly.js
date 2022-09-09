function o(o) {
    console.log(o === this ? "global" : o === i ? "foo" : o);
}
var i = {
    func_no_this: function () {
        o();
    },
    func_with_this: function () {
        o(this);
    },
    arrow_no_this: () => {
        o();
    },
    arrow_with_this: () => {
        o(this);
    },
};
for (var n in i) i[n]();
