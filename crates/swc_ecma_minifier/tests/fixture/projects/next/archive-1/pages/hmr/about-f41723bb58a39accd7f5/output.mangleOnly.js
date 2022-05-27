(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [
        106
    ],
    {
        1962: function(c, a, b) {
            "use strict";
            b.r(a);
            var d = b(4512);
            a["default"] = function() {
                return (0, d.jsx)("div", {
                    className: "hmr-about-page",
                    children: (0, d.jsx)("p", {
                        children: "This is the about page."
                    })
                });
            };
        },
        2856: function(a, b, c) {
            (window.__NEXT_P = window.__NEXT_P || []).push([
                "/hmr/about",
                function() {
                    return c(1962);
                }, 
            ]);
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
            return c(2856);
        });
        var b = a.O();
        _N_E = b;
    }, 
]);
