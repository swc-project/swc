var a = [
    2,
    3
];
console.log.apply(console, [
    1,
    ...a,
    4
]);
