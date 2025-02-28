var n = {};
(function(n) {
    function o(o) {
        var n = {};
        function e() {
            return r({
                one: o.one,
                two: o.two
            });
        }
        n.inner = function() {
            return e();
        };
        return n;
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
var o = n.fail({
    one: "PASS"
});
console.log(o.inner());
