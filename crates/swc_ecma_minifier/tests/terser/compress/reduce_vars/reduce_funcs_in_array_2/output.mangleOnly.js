(function() {
    function c() {
        return 123;
    }
    function b(a) {
        return [
            a || c
        ].concat([
            2
        ]);
    }
    var a = [
        b(),
        b()
    ];
    console.log(a[0][0] === a[1][0], a[0][0]());
})();
