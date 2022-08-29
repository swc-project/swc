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
            function t(n, r, e, t, u, a, c) {
                try {
                    var i = n[a](c);
                    var s = i.value;
                } catch (o) {
                    e(o);
                    return;
                }
                if (i.done) {
                    r(s);
                } else {
                    Promise.resolve(s).then(t, u);
                }
            }
            function u(n) {
                return function() {
                    var r = this, e = arguments;
                    return new Promise(function(u, a) {
                        var c = n.apply(r, e);
                        function i(n) {
                            t(c, u, a, i, s, "next", n);
                        }
                        function s(n) {
                            t(c, u, a, i, s, "throw", n);
                        }
                        i(undefined);
                    });
                };
            }
        },
        1383: function(n, r, e) {
            e.r(r);
            var t = e(4512);
            var u = e(7945);
            var a = e.n(u);
            var c = e(6086);
            var i = e(4652);
            var s = (0, i.default)((0, c.Z)(a().mark(function n() {
                return a().wrap(function n(r) {
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
