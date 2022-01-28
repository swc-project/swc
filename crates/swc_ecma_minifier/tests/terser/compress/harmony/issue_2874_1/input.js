(function () {
    function foo() {
        let letters = ["A", "B", "C"];
        let result = [2, 1, 0].map((key) => bar(letters[key] + key));
        return result;
    }
    function bar(value) {
        return () => console.log(value);
    }
    foo().map((fn) => fn());
})();
