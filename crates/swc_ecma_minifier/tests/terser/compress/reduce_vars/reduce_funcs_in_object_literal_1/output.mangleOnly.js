(function() {
    function n() {
        return 123;
    }
    function o() {
        return [
            {
                prop: n
            }.prop
        ].concat([
            2
        ]);
    }
    var r = [
        o(),
        o()
    ];
    console.log(r[0][0] === r[1][0], r[0][0]());
})();
