(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [
        106
    ],
    {
        1962: function(n, r, u) {
            "use strict";
            u.r(r);
            var t = u(4512);
            r["default"] = function() {
                return (0, t.jsx)("div", {
                    className: "hmr-about-page",
                    children: (0, t.jsx)("p", {
                        children: "This is the about page."
                    })
                });
            };
        },
        2856: function(n, r, u) {
            (window.__NEXT_P = window.__NEXT_P || []).push([
                "/hmr/about",
                function() {
                    return u(1962);
                }, 
            ]);
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
            return r(2856);
        });
        var u = n.O();
        _N_E = u;
    }, 
]);
