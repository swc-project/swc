var a = {
    foo: 1,
    bar: 2,
    square: function(a) {
        return a * a;
    },
    cube: function(a) {
        return a * a * a;
    }
};
console.log(a.foo, a.bar, a.square(2), a.cube);
