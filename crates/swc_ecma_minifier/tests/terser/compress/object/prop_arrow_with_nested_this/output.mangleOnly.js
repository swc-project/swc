function n(n) {
    console.log(n === this ? "global" : n === o ? "foo" : n);
}
var o = {
    func_func_this: function () {
        (function () {
            n(this);
        })();
    },
    func_arrow_this: function () {
        (() => {
            n(this);
        })();
    },
    arrow_func_this: () => {
        (function () {
            n(this);
        })();
    },
    arrow_arrow_this: () => {
        (() => {
            n(this);
        })();
    },
};
for (var i in o) o[i]();
