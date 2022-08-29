(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [
        492
    ],
    {
        5467: function(n, u, a) {
            (window.__NEXT_P = window.__NEXT_P || []).push([
                "/no-spread",
                function() {
                    return a(1918);
                }, 
            ]);
            if (false) {}
        },
        2726: function(n, u, a) {
            "use strict";
            a.d(u, {
                Z: function() {
                    return c;
                }
            });
            var r = a(5893);
            var e = a(7294);
            function t(n) {
                var u = n.value, a = n.onChange;
                return (0, r.jsx)("input", {
                    value: u,
                    onChange: a
                });
            }
            var o = t;
            function v(n) {
                var u = n.value, a = n.onChange;
                (0, e.useEffect)(function() {
                    console.log("EFFECT");
                }, []);
                return (0, r.jsx)(o, {
                    value: u,
                    onChange: a
                });
            }
            var c = v;
        },
        1918: function(n, u, a) {
            "use strict";
            a.r(u);
            a.d(u, {
                default: function() {
                    return c;
                }
            });
            var r = a(5893);
            var e = a(7294);
            var t = a(2726);
            function o(n) {
                var u = n.value, a = n.onChange;
                return (0, r.jsx)(t.Z, {
                    value: u,
                    onChange: a
                });
            }
            var v = o;
            function c() {
                var n = (0, e.useState)(""), u = n[0], a = n[1];
                var t = (0, e.useCallback)(function(n) {
                    a(n.target.value);
                }, []);
                return (0, r.jsx)(v, {
                    onChange: t,
                    value: u
                });
            }
        }
    },
    function(n) {
        var u = function(u) {
            return n((n.s = u));
        };
        n.O(0, [
            774,
            888,
            179
        ], function() {
            return u(5467);
        });
        var a = n.O();
        _N_E = a;
    }, 
]);
