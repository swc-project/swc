function run() {
    if (this.count++) this.foo();
    else this.bar();
}
var o = {
    count: 0,
    foo: function () {
        console.log("foo");
    },
    bar: function () {
        console.log("bar");
    },
};
run.call(o);
run.call(o);
