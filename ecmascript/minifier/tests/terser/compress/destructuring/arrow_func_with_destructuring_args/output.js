(({ foo: o = 1, bar: a = 2 }, [b = 3, l = 4]) => {
    console.log(o, a, b, l);
})({ bar: 5 }, [, 6]);
