var a = {};
(function(a) {
    function b(b) {
        var a = {};
        function d() {
            return c({
                one: b.one,
                two: b.two
            });
        }
        a.inner = function() {
            return d();
        };
        return a;
    }
    function c(a) {
        var b;
        if (a) {
            b = a.one;
        } else {
            b = a.two;
        }
        return b;
    }
    a.fail = b;
})(a);
var b = a.fail({
    one: "PASS"
});
console.log(b.inner());
