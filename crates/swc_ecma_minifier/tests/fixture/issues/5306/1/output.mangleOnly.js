const a = [
    1,
    2,
    3
];
const b = [
    ...a
];
a.length = 0;
console.log(b);
