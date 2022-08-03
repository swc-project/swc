var g = {
    x: 1
};
console.log({
    ...(g, g)
});
console.log({
    ...g,
    a: g
});
console.log({
    ...(g || g)
});
console.log({
    ...(g || g)
});
