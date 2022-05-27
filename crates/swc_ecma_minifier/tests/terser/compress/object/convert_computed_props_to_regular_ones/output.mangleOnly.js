var a = {
    ["hi"]: 0,
    ["A" + 1]: 1,
    [/B/]: 2,
    [100 + 23]: 3,
    [1 + 0.5]: 4,
    [Math.PI]: 5,
    [undefined]: 6,
    [true]: 7,
    [false]: 8,
    [null]: 9,
    [Infinity]: 10,
    [NaN]: 11
};
for(var b in a){
    console.log(b, a[b]);
}
