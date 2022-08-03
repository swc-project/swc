var g = [
    1
];
console.log([
    ...(g, g)
]);
console.log([
    ...g,
    g
]);
console.log([
    ...(g || g)
]);
console.log([
    ...(g || g)
]);
