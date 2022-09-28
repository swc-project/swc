var o = {
    foo: function() {
        for(this.b in [
            1,
            2
        ]);
    }
};
o.foo();
console.log(o.b);
