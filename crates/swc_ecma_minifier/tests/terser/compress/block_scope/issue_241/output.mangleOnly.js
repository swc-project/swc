var n = {};
(function(n) {
    function r(n) {
        var r = {};
        function e() {
            return o({
                one: n.one,
                two: n.two
            });
        }
        r.inner = function() {
            return e();
        };
        return r;
    }
    function o(n) {
        var r;
        if (n) {
            r = n.one;
        } else {
            r = n.two;
        }
        return r;
    }
    n.fail = r;
})(n);
var r = n.fail({
    one: "PASS"
});
console.log(r.inner());
