const foo = {
    x: 1,
    y: () => foo
};
console.log(foo.y().x); // should log: 1