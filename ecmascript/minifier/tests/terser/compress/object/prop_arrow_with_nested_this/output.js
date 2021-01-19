function run(arg) {
    console.log(arg === this ? "global" : arg === foo ? "foo" : arg);
}
var foo = {
    func_func_this() {
        (function () {
            run(this);
        })();
    },
    func_arrow_this() {
        (() => {
            run(this);
        })();
    },
    arrow_func_this() {
        (function () {
            run(this);
        })();
    },
    arrow_arrow_this: () => {
        (() => {
            run(this);
        })();
    },
};
for (var key in foo) foo[key]();
