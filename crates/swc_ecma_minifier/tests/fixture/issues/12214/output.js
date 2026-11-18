const __proto__ = 0;
console.log([
    "a"
]);
console.log([
    "b"
]);
console.log([
    "__proto__"
]);
console.log(Object.keys({
    ["__proto__"]: 1
}));
console.log(Object.keys({
    __proto__ () {}
}));
console.log([
    "a",
    "b"
]);
