function foo() {}
console.log(
    (foo(),
    function () {
        return 42;
    })()
);
