var o = {
    foo: 1,
    bar: 2,
    square: function (o) {
        return o * o;
    },
    cube: function (o) {
        return o * o * o;
    },
};
console.log(o.foo, o.cube(3));
