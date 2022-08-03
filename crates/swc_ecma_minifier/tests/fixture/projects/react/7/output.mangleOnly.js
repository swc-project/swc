function n(n, r) {
    function t(n) {
        var r = /[=:]/g;
        var t = {
            "=": "=0",
            ":": "=2"
        };
        var e = n.replace(r, function(n) {
            return t[n];
        });
        return "$" + e;
    }
    if (typeof n === "object" && n !== null && n.key != null) {
        return t("" + n.key);
    }
    return r.toString(36);
}
