(function () {
    function f() {
        console.log(this.p);
    }
    ({ p: "PASS", f: f }.f());
    var o;
})();
