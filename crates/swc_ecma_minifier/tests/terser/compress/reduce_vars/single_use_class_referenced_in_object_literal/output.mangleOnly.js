(function() {
    class n {
        data() {
            return 123;
        }
    }
    function a(a) {
        return [
            {
                prop: a || n
            }.prop
        ].concat([
            2
        ]);
    }
    var r = [
        a(),
        a()
    ];
    console.log(r[0][0] === r[1][0], new r[0][0]().data());
})();
