var o = {
    hi: 0,
    ["A" + "1"]: 1,
    [/B/]: 2,
    [100 + 23]: 3,
    [1 + 0.5]: 4,
    [Math.PI]: 5,
    [void 0]: 6,
    [!0]: 7,
    [!1]: 8,
    [null]: 9,
    [1 / 0]: 10,
    [NaN]: 11
};
for(var k in o)console.log(k, o[k]);
