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
console.log(1, 2, obj.square(2), obj.cube);
