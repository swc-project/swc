(function () {
    function Foo() {
        return 123;
    }
    function bar() {
        var prop = Foo;
        return [{ prop }.prop].concat([2]);
    }
    var a = [bar(), bar()];
    console.log(a[0][0] === a[1][0], a[0][0]());
})();
