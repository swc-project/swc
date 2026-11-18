(function() {
    class n {
        data() {
            return 123;
        }
    }
    function a(a) {
        var o = a || n;
        return [
            {
                prop: o
            }.prop
        ].concat([
            2
        ]);
    }
    var o = [
        a(),
        a()
    ];
    console.log(o[0][0] === o[1][0], new o[0][0]().data());
})();
