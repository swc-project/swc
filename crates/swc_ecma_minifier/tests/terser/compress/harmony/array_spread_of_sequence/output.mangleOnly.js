var a = [
    1
];
console.log([
    ...(a, a)
]);
console.log([
    ...a,
    a
]);
console.log([
    ...(a || a)
]);
console.log([
    ...(a || a)
]);
