(function() {
    function r() {
        return 123;
    }
    function o() {
        return [
            {
                prop: r
            }.prop
        ].concat([
            2
        ]);
    }
    var n = [
        o(),
        o()
    ];
    console.log(n[0][0] === n[1][0], n[0][0]());
})();
