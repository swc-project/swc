(function({ foo: o = 1 + 0 , bar: a = 2  }, [b = 3, f = 4]) {
    console.log(o, a, b, f);
})({
    bar: 5 - 0
}, [
    ,
    6
]);
