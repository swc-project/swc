(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [
        405
    ],
    {
        4208: function(a, b, c) {
            "use strict";
            c.r(b);
            var d = c(4512);
            b["default"] = function() {
                return (0, d.jsx)("div", {
                    className: "hmr-about-page",
                    children: (0, d.jsx)("p", {
                        children: "This is the about page."
                    })
                });
            };
        },
        9037: function(a, b, c) {
            (window.__NEXT_P = window.__NEXT_P || []).push([
                "/hmr/about7",
                function() {
                    return c(4208);
                }, 
            ]);
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
            return b(9037);
        });
        var c = a.O();
        _N_E = c;
    }, 
]);
