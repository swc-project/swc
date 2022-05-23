function f() {
    var that = this;
    if (that.bar) that.foo();
    else
        ((that, self) => {
            console.log(this === that, self === this, that === self);
        })(that, this);
}
f.call({
    bar: 1,
    foo: function () {
        console.log("foo", this.bar);
    },
});
f.call({});
