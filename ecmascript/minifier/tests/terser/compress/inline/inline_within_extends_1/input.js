(function () {
    function foo(foo_base) {
        return class extends foo_base {};
    }
    function bar(bar_base) {
        return class extends bar_base {};
    }
    console.log(new (class extends foo(bar(Array)) {})().concat(["PASS"])[0]);
})();
