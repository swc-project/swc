(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [
        25
    ],
    {
        1107: function(n, u, e) {
            "use strict";
            e.r(u);
            var t = e(4512);
            u["default"] = function() {
                return (0, t.jsx)("div", {
                    className: "hmr-about-page",
                    children: (0, t.jsx)("p", {
                        children: "This is the about page."
                    })
                });
            };
        },
        8000: function(n, u, e) {
            (window.__NEXT_P = window.__NEXT_P || []).push([
                "/hmr/about1",
                function() {
                    return e(1107);
                }, 
            ]);
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
            return u(8000);
        });
        var e = n.O();
        _N_E = e;
    }, 
]);
