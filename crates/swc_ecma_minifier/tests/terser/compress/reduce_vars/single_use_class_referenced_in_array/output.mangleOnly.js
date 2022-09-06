(function () {
    class n {
        data() {
            return 123;
        }
    }
    function a(a) {
        return [a || n].concat([2]);
    }
    var t = [a(), a()];
    console.log(t[0][0] === t[1][0], new t[0][0]().data());
})();
