(function() {
    function n() {
        return 123;
    }
    function t() {
        return [
            n
        ].concat([
            2
        ]);
    }
    var c = [
        t(),
        t()
    ];
    console.log(c[0][0] === c[1][0], c[0][0]());
})();
