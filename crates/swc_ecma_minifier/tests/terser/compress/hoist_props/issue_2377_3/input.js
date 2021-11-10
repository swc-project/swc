var obj = {
    foo: 1,
    bar: 2,
    square: function (x) {
        return x * x;
    },
    cube: function (x) {
        return x * x * x;
    },
};
console.log(obj.foo, obj.cube(3));
