function run(arg) {
    console.log(arg === this ? "global" : arg === foo ? "foo" : arg);
}
var foo = {
    func_no_this: function () {
        run();
    },
    func_with_this: function () {
        run(this);
    },
    arrow_no_this: () => {
        run();
    },
    arrow_with_this: () => {
        run(this);
    },
};
for (var key in foo) foo[key]();
