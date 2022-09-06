function o() {
    var o = this;
    if (o.count++) o.foo();
    else o.bar();
}
var n = {
    count: 0,
    foo: function () {
        console.log("foo");
    },
    bar: function () {
        console.log("bar");
    },
};
o.call(n);
o.call(n);
