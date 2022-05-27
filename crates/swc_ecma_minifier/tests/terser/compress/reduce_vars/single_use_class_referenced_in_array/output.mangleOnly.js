(function() {
    class c {
        data() {
            return 123;
        }
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
    console.log(a[0][0] === a[1][0], new a[0][0]().data());
})();
