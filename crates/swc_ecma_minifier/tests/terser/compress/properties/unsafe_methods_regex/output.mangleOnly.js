var a = {
    123: function() {
        console.log("123");
    },
    foo: function() {
        console.log("foo");
    },
    bar () {
        console.log("bar");
    },
    Baz: function() {
        console.log("baz");
    },
    BOO: function() {
        console.log("boo");
    },
    null: function() {
        console.log("null");
    },
    undefined: function() {
        console.log("undefined");
    }
};
a[123]();
new a.foo();
a.bar();
a.Baz();
a.BOO();
new a.null();
new a.undefined();
