(function () {
    function foo(x) {
        return x.toUpperCase();
    }
    console.log((() => foo("pass"))());
})();
