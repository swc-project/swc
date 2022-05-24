function fn(bar) {
    const foo = (64206).toString(16);
    return eval(bar);
}
console.log(fn("foo + bar"));
