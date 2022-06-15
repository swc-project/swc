(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [
        492
    ],
    {
        5467: function(a, b, c) {
            (window.__NEXT_P = window.__NEXT_P || []).push([
                "/no-spread",
                function() {
                    return c(1918);
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
        1918: function(a, b, c) {
            "use strict";
            c.r(b);
            c.d(b, {
                default: function() {
                    return i;
                }
            });
            var d = c(5893);
            var e = c(7294);
            var f = c(2726);
            function g(a) {
                var b = a.value, c = a.onChange;
                return (0, d.jsx)(f.Z, {
                    value: b,
                    onChange: c
                });
            }
            var h = g;
            function i() {
                var a = (0, e.useState)(""), b = a[0], c = a[1];
                var f = (0, e.useCallback)(function(a) {
                    c(a.target.value);
                }, []);
                return (0, d.jsx)(h, {
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
            return b(5467);
        });
        var c = a.O();
        _N_E = c;
    }, 
]);
