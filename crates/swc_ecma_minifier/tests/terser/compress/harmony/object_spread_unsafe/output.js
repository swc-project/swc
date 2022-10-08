var o = {
    x: 1,
    y: 2
};
console.log({
    ...o
}, {
    ...o,
    x: 3,
    z: 4
});
