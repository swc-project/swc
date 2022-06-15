"use strict";
(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [
        383
    ],
    {
        6086: function(a, b, c) {
            c.d(b, {
                Z: function() {
                    return e;
                }
            });
            function d(a, b, c, d, e, f, g) {
                try {
                    var h = a[f](g);
                    var i = h.value;
                } catch (j) {
                    c(j);
                    return;
                }
                if (h.done) {
                    b(i);
                } else {
                    Promise.resolve(i).then(d, e);
                }
            }
            function e(a) {
                return function() {
                    var b = this, c = arguments;
                    return new Promise(function(e, f) {
                        var g = a.apply(b, c);
                        function h(a) {
                            d(g, e, f, h, i, "next", a);
                        }
                        function i(a) {
                            d(g, e, f, h, i, "throw", a);
                        }
                        h(undefined);
                    });
                };
            }
        },
        1383: function(a, b, c) {
            c.r(b);
            var d = c(4512);
            var e = c(7945);
            var f = c.n(e);
            var g = c(6086);
            var h = c(4652);
            var i = (0, h.default)((0, g.Z)(f().mark(function a() {
                return f().wrap(function a(b) {
                    while(1){
                        switch((b.prev = b.next)){
                            case 0:
                                return b.abrupt("return", function() {
                                    return (0, d.jsx)("div", {
                                        children: "Browser hydrated"
                                    });
                                });
                            case 1:
                            case "end":
                                return b.stop();
                        }
                    }
                }, a);
            })), {
                ssr: false
            });
            b["default"] = function() {
                return (0, d.jsxs)("div", {
                    children: [
                        (0, d.jsx)("div", {
                            children: "Nested 2"
                        }),
                        (0, d.jsx)(i, {}), 
                    ]
                });
            };
        }
    }, 
]);
