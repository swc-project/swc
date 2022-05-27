function a() {
    var a = this;
    if (a.bar) a.foo();
    else !(function(a, b) {
        console.log(this === a, b === this, a === b);
    })(a, this);
}
a.call({
    bar: 1,
    foo: function() {
        console.log("foo", this.bar);
    }
});
a.call({});
