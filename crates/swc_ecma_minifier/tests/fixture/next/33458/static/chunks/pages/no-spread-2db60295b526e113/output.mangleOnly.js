(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [
        492
    ],
    {
        5467: function(n, u, e) {
            (window.__NEXT_P = window.__NEXT_P || []).push([
                "/no-spread",
                function() {
                    return e(1918);
                }, 
            ]);
            if (false) {}
        },
        2726: function(n, u, e) {
            "use strict";
            e.d(u, {
                Z: function() {
                    return c;
                }
            });
            var a = e(5893);
            var r = e(7294);
            function t(n) {
                var u = n.value, e = n.onChange;
                return (0, a.jsx)("input", {
                    value: u,
                    onChange: e
                });
            }
            var o = t;
            function v(n) {
                var u = n.value, e = n.onChange;
                (0, r.useEffect)(function() {
                    console.log("EFFECT");
                }, []);
                return (0, a.jsx)(o, {
                    value: u,
                    onChange: e
                });
            }
            var c = v;
        },
        1918: function(n, u, e) {
            "use strict";
            e.r(u);
            e.d(u, {
                default: function() {
                    return c;
                }
            });
            var a = e(5893);
            var r = e(7294);
            var t = e(2726);
            function o(n) {
                var u = n.value, e = n.onChange;
                return (0, a.jsx)(t.Z, {
                    value: u,
                    onChange: e
                });
            }
            var v = o;
            function c() {
                var n = (0, r.useState)(""), u = n[0], e = n[1];
                var t = (0, r.useCallback)(function(n) {
                    e(n.target.value);
                }, []);
                return (0, a.jsx)(v, {
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
        var e = n.O();
        _N_E = e;
    }, 
]);
