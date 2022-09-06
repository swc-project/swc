(function () {
    function n() {
        return 123;
    }
    function o(o) {
        return [o || n].concat([2]);
    }
    var c = [o(), o()];
    console.log(c[0][0] === c[1][0], c[0][0]());
})();
