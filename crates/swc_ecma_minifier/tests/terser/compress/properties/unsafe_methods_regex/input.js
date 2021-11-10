var f = {
    123: function () {
        console.log("123");
    },
    foo: function () {
        console.log("foo");
    },
    bar() {
        console.log("bar");
    },
    Baz: function () {
        console.log("baz");
    },
    BOO: function () {
        console.log("boo");
    },
    null: function () {
        console.log("null");
    },
    undefined: function () {
        console.log("undefined");
    },
};
f[123]();
new f.foo();
f.bar();
f.Baz();
f.BOO();
new f.null();
new f.undefined();
