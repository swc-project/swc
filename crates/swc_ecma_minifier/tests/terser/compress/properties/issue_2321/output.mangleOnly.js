var a = {
    foo: function() {
        console.log("foo");
    },
    bar () {
        console.log("bar");
    }
};
var b = new a.foo();
var c = a.bar();
