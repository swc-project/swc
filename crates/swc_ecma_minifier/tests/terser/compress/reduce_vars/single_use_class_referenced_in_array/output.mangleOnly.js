(function() {
    class a {
        data() {
            return 123;
        }
    }
    function b(b) {
        return [
            b || a
        ].concat([
            2
        ]);
    }
    var c = [
        b(),
        b()
    ];
    console.log(c[0][0] === c[1][0], new c[0][0]().data());
})();
