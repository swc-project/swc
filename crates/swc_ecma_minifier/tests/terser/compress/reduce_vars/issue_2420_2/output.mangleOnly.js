function i() {
    var i = this;
    if (i.bar) i.foo();
    else !(function(i, o) {
        console.log(this === i, o === this, i === o);
    })(i, this);
}
i.call({
    bar: 1,
    foo: function() {
        console.log("foo", this.bar);
    }
});
i.call({});
