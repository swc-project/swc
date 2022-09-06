function o() {
    var o = this;
    if (o.bar) o.foo();
    else
        ((o, l) => {
            console.log(this === o, l === this, o === l);
        })(o, this);
}
o.call({
    bar: 1,
    foo: function () {
        console.log("foo", this.bar);
    },
});
o.call({});
