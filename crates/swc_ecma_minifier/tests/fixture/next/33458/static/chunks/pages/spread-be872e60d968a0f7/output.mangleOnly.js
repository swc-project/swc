(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [
        217
    ],
    {
        2809: function(a, b, c) {
            (window.__NEXT_P = window.__NEXT_P || []).push([
                "/spread",
                function() {
                    return c(1767);
                }, 
            ]);
            if (false) {}
        },
        2726: function(a, b, c) {
            "use strict";
            c.d(b, {
                Z: function() {
                    return i;
                }
            });
            var d = c(5893);
            var e = c(7294);
            function f(a) {
                var b = a.value, c = a.onChange;
                return (0, d.jsx)("input", {
                    value: b,
                    onChange: c
                });
            }
            var g = f;
            function h(a) {
                var b = a.value, c = a.onChange;
                (0, e.useEffect)(function() {
                    console.log("EFFECT");
                }, []);
                return (0, d.jsx)(g, {
                    value: b,
                    onChange: c
                });
            }
            var i = h;
        },
        1767: function(a, b, c) {
            "use strict";
            c.r(b);
            c.d(b, {
                default: function() {
                    return k;
                }
            });
            var d = c(5893);
            var e = c(7294);
            var f = c(2726);
            function g(a, b, c) {
                if (b in a) {
                    Object.defineProperty(a, b, {
                        value: c,
                        enumerable: true,
                        configurable: true,
                        writable: true
                    });
                } else {
                    a[b] = c;
                }
                return a;
            }
            function h(a) {
                for(var b = 1; b < arguments.length; b++){
                    var c = arguments[b] != null ? arguments[b] : {};
                    var d = Object.keys(c);
                    if (typeof Object.getOwnPropertySymbols === "function") {
                        d = d.concat(Object.getOwnPropertySymbols(c).filter(function(a) {
                            return Object.getOwnPropertyDescriptor(c, a).enumerable;
                        }));
                    }
                    d.forEach(function(b) {
                        g(a, b, c[b]);
                    });
                }
                return a;
            }
            function i(a) {
                return (0, d.jsx)(f.Z, h({}, a));
            }
            var j = i;
            function k() {
                var a = (0, e.useState)(""), b = a[0], c = a[1];
                var f = (0, e.useCallback)(function(a) {
                    c(a.target.value);
                }, []);
                return (0, d.jsx)(j, {
                    onChange: f,
                    value: b
                });
            }
        }
    },
    function(a) {
        var b = function(b) {
            return a((a.s = b));
        };
        a.O(0, [
            774,
            888,
            179
        ], function() {
            return b(2809);
        });
        var c = a.O();
        _N_E = c;
    }, 
]);
