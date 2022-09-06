function o() {
    var o = this;
    if (o.bar) o.foo();
    else
        !(function (o, i) {
            console.log(this === o, i === this, o === i);
        })(o, this);
}
o.call({
    bar: 1,
    foo: function () {
        console.log("foo", this.bar);
    },
});
o.call({});
