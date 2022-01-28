(function ({ foo: foo = 1 + 0, bar: bar = 2 }, [car = 3, far = 4]) {
    console.log(foo, bar, car, far);
})({ bar: 5 - 0 }, [, 6]);
