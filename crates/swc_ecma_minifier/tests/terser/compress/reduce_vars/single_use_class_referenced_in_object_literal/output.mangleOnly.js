(function () {
    class n {
        data() {
            return 123;
        }
    }
    function o(o) {
        return [{ prop: o || n }.prop].concat([2]);
    }
    var a = [o(), o()];
    console.log(a[0][0] === a[1][0], new a[0][0]().data());
})();
