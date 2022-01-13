const foo = async (x, y, ...z) => {
    return this;
};

console.log(foo.length)
console.log(typeof foo(1, 2, 3) === 'function')