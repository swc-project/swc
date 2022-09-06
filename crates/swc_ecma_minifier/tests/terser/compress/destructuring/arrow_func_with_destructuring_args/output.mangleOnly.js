(({ foo: o = 1 + 0, bar: a = 2 }, [b = 3, l = 4]) => {
    console.log(o, a, b, l);
})({ bar: 5 - 0 }, [, 6]);
