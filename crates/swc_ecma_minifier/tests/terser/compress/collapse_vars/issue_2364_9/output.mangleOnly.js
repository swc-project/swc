function a(a, b) {
    var c = a();
    return b.f(c);
}
var b = {
    f: function() {
        return "FAIL";
    }
};
console.log(a(function() {
    b.f = function() {
        return "PASS";
    };
}, b));
