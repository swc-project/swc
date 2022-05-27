function a(a, b) {
    function c(a) {
        var b = /[=:]/g;
        var d = {
            "=": "=0",
            ":": "=2"
        };
        var c = a.replace(b, function(a) {
            return d[a];
        });
        return "$" + c;
    }
    if (typeof a === "object" && a !== null && a.key != null) {
        return c("" + a.key);
    }
    return b.toString(36);
}
