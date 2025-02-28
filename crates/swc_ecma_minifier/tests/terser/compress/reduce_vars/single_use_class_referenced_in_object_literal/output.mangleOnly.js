(function() {
    class a {
        data() {
            return 123;
        }
    }
    function o(n) {
        return [
            {
                prop: n || a
            }.prop
        ].concat([
            2
        ]);
    }
    var n = [
        o(),
        o()
    ];
    console.log(n[0][0] === n[1][0], new n[0][0]().data());
})();
