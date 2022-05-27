(function({ foo: a = 1 + 0 , bar: b = 2  }, [c = 3, d = 4]) {
    console.log(a, b, c, d);
})({
    bar: 5 - 0
}, [
    ,
    6
]);
