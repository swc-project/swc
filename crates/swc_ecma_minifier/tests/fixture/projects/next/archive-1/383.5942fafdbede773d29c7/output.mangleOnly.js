"use strict";
(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [
        383
    ],
    {
        6086: function(c, a, b) {
            b.d(a, {
                Z: function() {
                    return e;
                }
            });
            function d(c, d, e, f, g, h, i) {
                try {
                    var a = c[h](i);
                    var b = a.value;
                } catch (j) {
                    e(j);
                    return;
                }
                if (a.done) {
                    d(b);
                } else {
                    Promise.resolve(b).then(f, g);
                }
            }
            function e(a) {
                return function() {
                    var b = this, c = arguments;
                    return new Promise(function(f, g) {
                        var h = a.apply(b, c);
                        function e(a) {
                            d(h, f, g, e, i, "next", a);
                        }
                        function i(a) {
                            d(h, f, g, e, i, "throw", a);
                        }
                        e(undefined);
                    });
                };
            }
        },
        1383: function(g, b, a) {
            a.r(b);
            var h = a(4512);
            var c = a(7945);
            var d = a.n(c);
            var e = a(6086);
            var f = a(4652);
            var i = (0, f.default)((0, e.Z)(d().mark(function a() {
                return d().wrap(function b(a) {
                    while(1){
                        switch((a.prev = a.next)){
                            case 0:
                                return a.abrupt("return", function() {
                                    return (0, h.jsx)("div", {
                                        children: "Browser hydrated"
                                    });
                                });
                            case 1:
                            case "end":
                                return a.stop();
                        }
                    }
                }, a);
            })), {
                ssr: false
            });
            b["default"] = function() {
                return (0, h.jsxs)("div", {
                    children: [
                        (0, h.jsx)("div", {
                            children: "Nested 2"
                        }),
                        (0, h.jsx)(i, {}), 
                    ]
                });
            };
        }
    }, 
]);
