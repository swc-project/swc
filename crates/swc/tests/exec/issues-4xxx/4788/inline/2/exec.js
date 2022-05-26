let id = 0;

const obj = {
    foo: 1,
    bar: 2,
    baz: 3,
};

console.log({
    ...obj,
    ...obj,
    foo: 10,
});

console.log({
    ...obj,
    foo: 10,
    ...obj,
    bar: 120,
});
