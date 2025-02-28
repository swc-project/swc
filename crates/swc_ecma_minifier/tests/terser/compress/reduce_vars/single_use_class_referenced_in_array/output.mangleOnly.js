(function() {
    class t {
        data() {
            return 123;
        }
    }
    function a(n) {
        return [
            n || t
        ].concat([
            2
        ]);
    }
    var n = [
        a(),
        a()
    ];
    console.log(n[0][0] === n[1][0], new n[0][0]().data());
})();
