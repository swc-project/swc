function test(foo, bar) {
    try {
        const bar = {};
        throw "PASS";
    } catch (error) {
        return bar(error);
    }
}
console.log(test(null, (x) => x));
