var a = {};
(function(a) {
    function b(a) {
        var b = {};
        function d() {
            return c({
                one: a.one,
                two: a.two
            });
        }
        b.inner = function() {
            return d();
        };
        return b;
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
