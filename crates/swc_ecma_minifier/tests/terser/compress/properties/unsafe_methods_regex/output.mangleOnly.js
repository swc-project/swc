var o = {
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
o[123]();
new o.foo();
o.bar();
o.Baz();
o.BOO();
new o.null();
new o.undefined();
