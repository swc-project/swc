(function () {
    function Foo() {
        return 123;
    }
    function bar(val) {
        return [val || Foo].concat([2]);
    }
    var a = [bar(), bar()];
    console.log(a[0][0] === a[1][0], a[0][0]());
})();
