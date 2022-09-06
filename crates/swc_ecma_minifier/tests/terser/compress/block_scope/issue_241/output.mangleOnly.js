var n = {};
(function (n) {
    function o(n) {
        var o = {};
        function e() {
            return r({ one: n.one, two: n.two });
        }
        o.inner = function () {
            return e();
        };
        return o;
    }
    function r(n) {
        var o;
        if (n) {
            o = n.one;
        } else {
            o = n.two;
        }
        return o;
    }
    n.fail = o;
})(n);
var o = n.fail({ one: "PASS" });
console.log(o.inner());
