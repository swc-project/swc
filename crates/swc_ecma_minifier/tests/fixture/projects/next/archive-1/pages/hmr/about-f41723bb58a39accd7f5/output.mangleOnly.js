(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [
        106
    ],
    {
        1962: function(n, u, t) {
            "use strict";
            t.r(u);
            var r = t(4512);
            u["default"] = function() {
                return (0, r.jsx)("div", {
                    className: "hmr-about-page",
                    children: (0, r.jsx)("p", {
                        children: "This is the about page."
                    })
                });
            };
        },
        2856: function(n, u, t) {
            (window.__NEXT_P = window.__NEXT_P || []).push([
                "/hmr/about",
                function() {
                    return t(1962);
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
            return u(2856);
        });
        var t = n.O();
        _N_E = t;
    }, 
]);
