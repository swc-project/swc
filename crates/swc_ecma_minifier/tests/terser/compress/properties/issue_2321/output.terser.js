var f = {
    foo: function () {
        console.log("foo");
    },
    bar() {
        console.log("bar");
    },
};
var foo = new f.foo();
var bar = f.bar();
