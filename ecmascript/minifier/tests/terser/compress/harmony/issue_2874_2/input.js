(function () {
    let keys = [];
    function foo() {
        var result = [2, 1, 0].map((value) => {
            keys.push(value);
            return bar();
        });
        return result;
    }
    function bar() {
        var letters = ["A", "B", "C"],
            key = keys.shift();
        return () => console.log(letters[key] + key);
    }
    foo().map((fn) => fn());
})();
