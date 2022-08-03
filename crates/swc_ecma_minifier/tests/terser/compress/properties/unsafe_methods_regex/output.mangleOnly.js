var n = {
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
n[123]();
new n.foo();
n.bar();
n.Baz();
n.BOO();
new n.null();
new n.undefined();
