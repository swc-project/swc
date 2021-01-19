var a = {};
(function (global) {
    function fail(o) {
        var result = {};
        function inner() {
            return outer({ one: o.one, two: o.two });
        }
        result.inner = function () {
            return inner();
        };
        return result;
    }
    function outer(o) {
        var ret;
        if (o) {
            ret = o.one;
        } else {
            ret = o.two;
        }
        return ret;
    }
    global.fail = fail;
})(a);
var b = a.fail({ one: "PASS" });
console.log(b.inner());
