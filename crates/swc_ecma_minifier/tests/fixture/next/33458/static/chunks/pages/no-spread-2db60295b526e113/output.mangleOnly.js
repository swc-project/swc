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
        2726: function(e, b, a) {
            "use strict";
            a.d(b, {
                Z: function() {
                    return i;
                }
            });
            var f = a(5893);
            var g = a(7294);
            function c(a) {
                var b = a.value, c = a.onChange;
                return (0, f.jsx)("input", {
                    value: b,
                    onChange: c
                });
            }
            var h = c;
            function d(a) {
                var b = a.value, c = a.onChange;
                (0, g.useEffect)(function() {
                    console.log("EFFECT");
                }, []);
                return (0, f.jsx)(h, {
                    value: b,
                    onChange: c
                });
            }
            var i = d;
        },
        1918: function(d, b, a) {
            "use strict";
            a.r(b);
            a.d(b, {
                default: function() {
                    return i;
                }
            });
            var e = a(5893);
            var f = a(7294);
            var g = a(2726);
            function c(a) {
                var b = a.value, c = a.onChange;
                return (0, e.jsx)(g.Z, {
                    value: b,
                    onChange: c
                });
            }
            var h = c;
            function i() {
                var a = (0, f.useState)(""), b = a[0], d = a[1];
                var c = (0, f.useCallback)(function(a) {
                    d(a.target.value);
                }, []);
                return (0, e.jsx)(h, {
                    onChange: c,
                    value: b
                });
            }
        }
    },
    function(a) {
        var c = function(b) {
            return a((a.s = b));
        };
        a.O(0, [
            774,
            888,
            179
        ], function() {
            return c(5467);
        });
        var b = a.O();
        _N_E = b;
    }, 
]);
