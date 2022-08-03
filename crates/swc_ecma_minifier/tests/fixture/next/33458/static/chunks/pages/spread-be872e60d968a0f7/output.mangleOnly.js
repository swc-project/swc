(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [
        217
    ],
    {
        2809: function(n, r, e) {
            (window.__NEXT_P = window.__NEXT_P || []).push([
                "/spread",
                function() {
                    return e(1767);
                }, 
            ]);
            if (false) {}
        },
        2726: function(n, r, e) {
            "use strict";
            e.d(r, {
                Z: function() {
                    return i;
                }
            });
            var t = e(5893);
            var u = e(7294);
            function a(n) {
                var r = n.value, e = n.onChange;
                return (0, t.jsx)("input", {
                    value: r,
                    onChange: e
                });
            }
            var o = a;
            function f(n) {
                var r = n.value, e = n.onChange;
                (0, u.useEffect)(function() {
                    console.log("EFFECT");
                }, []);
                return (0, t.jsx)(o, {
                    value: r,
                    onChange: e
                });
            }
            var i = f;
        },
        1767: function(n, r, e) {
            "use strict";
            e.r(r);
            e.d(r, {
                default: function() {
                    return v;
                }
            });
            var t = e(5893);
            var u = e(7294);
            var a = e(2726);
            function o(n, r, e) {
                if (r in n) {
                    Object.defineProperty(n, r, {
                        value: e,
                        enumerable: true,
                        configurable: true,
                        writable: true
                    });
                } else {
                    n[r] = e;
                }
                return n;
            }
            function f(n) {
                for(var r = 1; r < arguments.length; r++){
                    var e = arguments[r] != null ? arguments[r] : {};
                    var t = Object.keys(e);
                    if (typeof Object.getOwnPropertySymbols === "function") {
                        t = t.concat(Object.getOwnPropertySymbols(e).filter(function(n) {
                            return Object.getOwnPropertyDescriptor(e, n).enumerable;
                        }));
                    }
                    t.forEach(function(r) {
                        o(n, r, e[r]);
                    });
                }
                return n;
            }
            function i(n) {
                return (0, t.jsx)(a.Z, f({}, n));
            }
            var c = i;
            function v() {
                var n = (0, u.useState)(""), r = n[0], e = n[1];
                var a = (0, u.useCallback)(function(n) {
                    e(n.target.value);
                }, []);
                return (0, t.jsx)(c, {
                    onChange: a,
                    value: r
                });
            }
        }
    },
    function(n) {
        var r = function(r) {
            return n((n.s = r));
        };
        n.O(0, [
            774,
            888,
            179
        ], function() {
            return r(2809);
        });
        var e = n.O();
        _N_E = e;
    }, 
]);
