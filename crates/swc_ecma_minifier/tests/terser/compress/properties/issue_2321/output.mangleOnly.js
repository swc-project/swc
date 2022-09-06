var o = {
    foo: function () {
        console.log("foo");
    },
    bar() {
        console.log("bar");
    },
};
var a = new o.foo();
var r = o.bar();
