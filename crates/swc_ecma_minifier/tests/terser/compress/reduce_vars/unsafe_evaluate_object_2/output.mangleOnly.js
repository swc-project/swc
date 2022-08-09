var r = {
    foo: 1,
    bar: 2,
    square: function(r) {
        return r * r;
    },
    cube: function(r) {
        return r * r * r;
    }
};
console.log(r.foo, r.bar, r.square(2), r.cube);
