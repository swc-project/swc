var foo = 1,
    bar;
foo.x = ((foo = {}), 10);
bar = ((bar = {}), 10);
console.log(foo, bar);
