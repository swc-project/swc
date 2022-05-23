var obj = {
    get foo() {
        return 1;
    },
    bar: 2,
    square: function (x) {
        return x * x;
    },
    cube: function (x) {
        return x * x * x;
    },
};
console.log(obj.foo, obj.bar, obj.square(2), obj.cube);
