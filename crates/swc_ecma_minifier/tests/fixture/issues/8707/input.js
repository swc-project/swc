function foo() {
    const a = x;
    var x = 42;
    return a;
}

console.log(foo())