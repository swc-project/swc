"use strict";
(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [
        383
    ],
    {
        6086: function(n, r, t) {
            t.d(r, {
                Z: function() {
                    return u;
                }
            });
            function e(n, r, t, e, u, c, a) {
                try {
                    var i = n[c](a);
                    var s = i.value;
                } catch (f) {
                    t(f);
                    return;
                }
                if (i.done) {
                    r(s);
                } else {
                    Promise.resolve(s).then(e, u);
                }
            }
            function u(n) {
                return function() {
                    var r = this, t = arguments;
                    return new Promise(function(u, c) {
                        var a = n.apply(r, t);
                        function i(n) {
                            e(a, u, c, i, s, "next", n);
                        }
                        function s(n) {
                            e(a, u, c, i, s, "throw", n);
                        }
                        i(undefined);
                    });
                };
            }
        },
        1383: function(n, r, t) {
            t.r(r);
            var e = t(4512);
            var u = t(7945);
            var c = t.n(u);
            var a = t(6086);
            var i = t(4652);
            var s = (0, i.default)((0, a.Z)(c().mark(function n() {
                return c().wrap(function n(r) {
                    while(1){
                        switch((r.prev = r.next)){
                            case 0:
                                return r.abrupt("return", function() {
                                    return (0, e.jsx)("div", {
                                        children: "Browser hydrated"
                                    });
                                });
                            case 1:
                            case "end":
                                return r.stop();
                        }
                    }
                }, n);
            })), {
                ssr: false
            });
            r["default"] = function() {
                return (0, e.jsxs)("div", {
                    children: [
                        (0, e.jsx)("div", {
                            children: "Nested 2"
                        }),
                        (0, e.jsx)(s, {}), 
                    ]
                });
            };
        }
    }, 
]);
