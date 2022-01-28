(function () {
    function inlinedFunction(data) {
        return data[data[0]];
    }
    function testMinify() {
        if (true) {
            const data = inlinedFunction([1, 2, 3]);
            console.log(data);
        }
    }
    return testMinify();
})();
