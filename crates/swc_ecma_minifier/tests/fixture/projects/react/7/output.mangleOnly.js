function a(a, b) {
    function c(a) {
        var b = /[=:]/g;
        var c = {
            "=": "=0",
            ":": "=2"
        };
        var d = a.replace(b, function(a) {
            return c[a];
        });
        return "$" + d;
    }
    if (typeof a === "object" && a !== null && a.key != null) {
        return c("" + a.key);
    }
    return b.toString(36);
}
