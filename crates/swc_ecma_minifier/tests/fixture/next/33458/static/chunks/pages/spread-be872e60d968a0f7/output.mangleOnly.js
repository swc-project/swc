(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [
        217
    ],
    {
        2809: function(n, e, r) {
            (window.__NEXT_P = window.__NEXT_P || []).push([
                "/spread",
                function() {
                    return r(1767);
                }, 
            ]);
            if (false) {}
        },
        2726: function(n, e, r) {
            "use strict";
            r.d(e, {
                Z: function() {
                    return f;
                }
            });
            var t = r(5893);
            var u = r(7294);
            function a(n) {
                var e = n.value, r = n.onChange;
                return (0, t.jsx)("input", {
                    value: e,
                    onChange: r
                });
            }
            var o = a;
            function c(n) {
                var e = n.value, r = n.onChange;
                (0, u.useEffect)(function() {
                    console.log("EFFECT");
                }, []);
                return (0, t.jsx)(o, {
                    value: e,
                    onChange: r
                });
            }
            var f = c;
        },
        1767: function(n, e, r) {
            "use strict";
            r.r(e);
            r.d(e, {
                default: function() {
                    return l;
                }
            });
            var t = r(5893);
            var u = r(7294);
            var a = r(2726);
            function o(n, e, r) {
                if (e in n) {
                    Object.defineProperty(n, e, {
                        value: r,
                        enumerable: true,
                        configurable: true,
                        writable: true
                    });
                } else {
                    n[e] = r;
                }
                return n;
            }
            function c(n) {
                for(var e = 1; e < arguments.length; e++){
                    var r = arguments[e] != null ? arguments[e] : {};
                    var t = Object.keys(r);
                    if (typeof Object.getOwnPropertySymbols === "function") {
                        t = t.concat(Object.getOwnPropertySymbols(r).filter(function(n) {
                            return Object.getOwnPropertyDescriptor(r, n).enumerable;
                        }));
                    }
                    t.forEach(function(e) {
                        o(n, e, r[e]);
                    });
                }
                return n;
            }
            function f(n) {
                return (0, t.jsx)(a.Z, c({}, n));
            }
            var i = f;
            function l() {
                var n = (0, u.useState)(""), e = n[0], r = n[1];
                var a = (0, u.useCallback)(function(n) {
                    r(n.target.value);
                }, []);
                return (0, t.jsx)(i, {
                    onChange: a,
                    value: e
                });
            }
        }
    },
    function(n) {
        var e = function(e) {
            return n((n.s = e));
        };
        n.O(0, [
            774,
            888,
            179
        ], function() {
            return e(2809);
        });
        var r = n.O();
        _N_E = r;
    }, 
]);
