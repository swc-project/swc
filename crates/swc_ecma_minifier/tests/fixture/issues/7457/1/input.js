function bar() {
    return function* () {
        yield foo();
    };
}
console.log(bar());