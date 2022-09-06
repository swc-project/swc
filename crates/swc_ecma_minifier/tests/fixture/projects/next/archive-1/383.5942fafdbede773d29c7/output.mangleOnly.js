"use strict";
(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [
        383
    ],
    {
        6086: function(n, r, e) {
            e.d(r, {
                Z: function() {
                    return u;
                }
            });
            function t(n, r, e, t, u, i, a) {
                try {
                    var c = n[i](a);
                    var s = c.value;
                } catch (f) {
                    e(f);
                    return;
                }
                if (c.done) {
                    r(s);
                } else {
                    Promise.resolve(s).then(t, u);
                }
            }
            function u(n) {
                return function() {
                    var r = this, e = arguments;
                    return new Promise(function(u, i) {
                        var a = n.apply(r, e);
                        function c(n) {
                            t(a, u, i, c, s, "next", n);
                        }
                        function s(n) {
                            t(a, u, i, c, s, "throw", n);
                        }
                        c(undefined);
                    });
                };
            }
        },
        1383: function(n, r, e) {
            e.r(r);
            var t = e(4512);
            var u = e(7945);
            var i = e.n(u);
            var a = e(6086);
            var c = e(4652);
            var s = (0, c.default)((0, a.Z)(i().mark(function n() {
                return i().wrap(function n(r) {
                    while(1){
                        switch((r.prev = r.next)){
                            case 0:
                                return r.abrupt("return", function() {
                                    return (0, t.jsx)("div", {
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
                return (0, t.jsxs)("div", {
                    children: [
                        (0, t.jsx)("div", {
                            children: "Nested 2"
                        }),
                        (0, t.jsx)(s, {}), 
                    ]
                });
            };
        }
    }, 
]);
