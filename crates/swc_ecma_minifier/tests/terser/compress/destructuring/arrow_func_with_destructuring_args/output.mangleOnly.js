(({ foo: o = 1 + 0 , bar: a = 2  }, [b = 3, r = 4])=>{
    console.log(o, a, b, r);
})({
    bar: 5 - 0
}, [
    ,
    6
]);
