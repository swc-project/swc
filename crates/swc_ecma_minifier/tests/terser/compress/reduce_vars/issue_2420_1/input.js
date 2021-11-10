function run() {
    var self = this;
    if (self.count++) self.foo();
    else self.bar();
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
