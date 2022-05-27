(function() {
    function c() {
        return 123;
    }
    function b() {
        return [
            c
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
