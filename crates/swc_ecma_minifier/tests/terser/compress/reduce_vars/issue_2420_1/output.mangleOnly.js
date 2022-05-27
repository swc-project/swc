function a() {
    var a = this;
    if (a.count++) a.foo();
    else a.bar();
}
var b = {
    count: 0,
    foo: function() {
        console.log("foo");
    },
    bar: function() {
        console.log("bar");
    }
};
a.call(b);
a.call(b);
