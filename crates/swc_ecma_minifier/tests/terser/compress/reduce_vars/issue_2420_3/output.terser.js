function f() {
    if (this.bar) this.foo();
    else
        ((that, self) => {
            console.log(this === that, self === this, that === self);
        })(this, this);
}
f.call({
    bar: 1,
    foo: function () {
        console.log("foo", this.bar);
    },
});
f.call({});
