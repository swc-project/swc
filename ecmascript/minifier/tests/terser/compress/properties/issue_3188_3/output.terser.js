(function () {
    function f() {
        console.log(this[0]);
    }
    ["PASS", f][1]();
    var o;
})();
