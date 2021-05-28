(function () {
    class Foo {
        data() {
            return 123;
        }
    }
    function bar(val) {
        return [{ prop: val || Foo }.prop].concat([2]);
    }
    var a = [bar(), bar()];
    console.log(a[0][0] === a[1][0], new a[0][0]().data());
})();
