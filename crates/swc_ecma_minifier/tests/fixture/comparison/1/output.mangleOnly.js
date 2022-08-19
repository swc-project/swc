self.push({
    9111: (function(n, u, r) {
        r.d(u, {
            "F": function() {
                return c;
            },
            "e": function() {
                return e;
            }
        });
        var t = r(27378);
        function c(...n) {
            return (u)=>n.forEach(((n)=>function(n, u) {
                        "function" == typeof n ? n(u) : null != n && (n.current = u);
                    }(n, u)));
        }
        function e(...n) {
            return t.useCallback(c(...n), n);
        }
    })
});
