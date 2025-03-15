function testFunc() {
    return +({
        x: (6 + 5) / 2
    }).x;
}
console.log(testFunc());
