module.exports = function () {
    var e = {
        770: function (e, t) {
            ! function (e, n) {
                true ? n(t) : 0
            }(this, function (e) {
                "use strict";
                var t, n, i, r, a = function (e, t) {
                    return {
                        name: e,
                        value: void 0 === t ? -1 : t,
                        delta: 0,
                        entries: [],
                        id: "v2-".concat(Date.now(), "-").concat(Math.floor(8999999999999 * Math.random()) + 1e12)
                    }
                },
                    o = function (e, t) {
                        try {
                            if (PerformanceObserver.supportedEntryTypes.includes(e)) {
                                if ("first-input" === e && !("PerformanceEventTiming" in self)) return;
                                var n = new PerformanceObserver(function (e) {
                                    return e.getEntries().map(t)
                                });
                                return n.observe({
                                    type: e,
                                    buffered: !0
                                }), n
                            }
                        } catch (e) { }
                    },
                    u = function (e, t) {
                        var i = function n(i) {
                            "pagehide" !== i.type && "hidden" !== document.visibilityState || (e(i), t && (removeEventListener("visibilitychange", n, !0), removeEventListener("pagehide", n, !0)))
                        };
                        addEventListener("visibilitychange", i, !0), addEventListener("pagehide", i, !0)
                    },
                    c = function (e) {
                        addEventListener("pageshow", function (t) {
                            t.persisted && e(t)
                        }, !0)
                    },
                    s = function (e, t, n) {
                        var i;
                        return function (r) {
                            t.value >= 0 && (r || n) && (t.delta = t.value - (i || 0), (t.delta || void 0 === i) && (i = t.value, e(t)))
                        }
                    },
                    f = -1,
                    v = function () {
                        return "hidden" === document.visibilityState ? 0 : 1 / 0
                    },
                    m = function () {
                        u(function (e) {
                            var t = e.timeStamp;
                            f = t
                        }, !0)
                    },
                    p = function () {
                        return f < 0 && (f = v(), m(), c(function () {
                            setTimeout(function () {
                                f = v(), m()
                            }, 0)
                        })), {
                            get firstHiddenTime() {
                                return f
                            }
                        }
                    },
                    d = function (e, t) {
                        var n, i = p(),
                            r = a("FCP"),
                            u = function (e) {
                                "first-contentful-paint" === e.name && (v && v.disconnect(), e.startTime < i.firstHiddenTime && (r.value = e.startTime, r.entries.push(e), n(!0)))
                            },
                            f = performance.getEntriesByName && performance.getEntriesByName("first-contentful-paint")[0],
                            v = f ? null : o("paint", u);
                        (f || v) && (n = s(e, r, t), f && u(f), c(function (i) {
                            r = a("FCP"), n = s(e, r, t), requestAnimationFrame(function () {
                                requestAnimationFrame(function () {
                                    r.value = performance.now() - i.timeStamp, n(!0)
                                })
                            })
                        }))
                    },
                    l = !1,
                    g = -1,
                    h = {
                        passive: !0,
                        capture: !0
                    },
                    y = new Date,
                    T = function (e, r) {
                        t || (t = r, n = e, i = new Date, w(removeEventListener), _())
                    },
                    _ = function () {
                        if (n >= 0 && n < i - y) {
                            var e = {
                                entryType: "first-input",
                                name: t.type,
                                target: t.target,
                                cancelable: t.cancelable,
                                startTime: t.timeStamp,
                                processingStart: t.timeStamp + n
                            };
                            r.forEach(function (t) {
                                t(e)
                            }), r = []
                        }
                    },
                    E = function (e) {
                        if (e.cancelable) {
                            var t = (e.timeStamp > 1e12 ? new Date : performance.now()) - e.timeStamp;
                            "pointerdown" == e.type ? function (e, t) {
                                var n = function () {
                                    T(e, t), r()
                                },
                                    i = function () {
                                        r()
                                    },
                                    r = function () {
                                        removeEventListener("pointerup", n, h), removeEventListener("pointercancel", i, h)
                                    };
                                addEventListener("pointerup", n, h), addEventListener("pointercancel", i, h)
                            }(t, e) : T(t, e)
                        }
                    },
                    w = function (e) {
                        ["mousedown", "keydown", "touchstart", "pointerdown"].forEach(function (t) {
                            return e(t, E, h)
                        })
                    },
                    S = new Set;
                e.getCLS = function (e, t) {
                    l || (d(function (e) {
                        g = e.value
                    }), l = !0);
                    var n, i = function (t) {
                        g > -1 && e(t)
                    },
                        r = a("CLS", 0),
                        f = 0,
                        v = [],
                        m = function (e) {
                            if (!e.hadRecentInput) {
                                var t = v[0],
                                    i = v[v.length - 1];
                                f && e.startTime - i.startTime < 1e3 && e.startTime - t.startTime < 5e3 ? (f += e.value, v.push(e)) : (f = e.value, v = [e]), f > r.value && (r.value = f, r.entries = v, n())
                            }
                        },
                        p = o("layout-shift", m);
                    p && (n = s(i, r, t), u(function () {
                        p.takeRecords().map(m), n(!0)
                    }), c(function () {
                        f = 0, g = -1, r = a("CLS", 0), n = s(i, r, t)
                    }))
                }, e.getFCP = d, e.getFID = function (e, i) {
                    var f, v = p(),
                        m = a("FID"),
                        d = function (e) {
                            e.startTime < v.firstHiddenTime && (m.value = e.processingStart - e.startTime, m.entries.push(e), f(!0))
                        },
                        l = o("first-input", d);
                    f = s(e, m, i), l && u(function () {
                        l.takeRecords().map(d), l.disconnect()
                    }, !0), l && c(function () {
                        var o;
                        m = a("FID"), f = s(e, m, i), r = [], n = -1, t = null, w(addEventListener), o = d, r.push(o), _()
                    })
                }, e.getLCP = function (e, t) {
                    var n, i = p(),
                        r = a("LCP"),
                        f = function (e) {
                            var t = e.startTime;
                            t < i.firstHiddenTime && (r.value = t, r.entries.push(e)), n()
                        },
                        v = o("largest-contentful-paint", f);
                    if (v) {
                        n = s(e, r, t);
                        var m = function () {
                            S.has(r.id) || (v.takeRecords().map(f), v.disconnect(), S.add(r.id), n(!0))
                        };
                        ["keydown", "click"].forEach(function (e) {
                            addEventListener(e, m, {
                                once: !0,
                                capture: !0
                            })
                        }), u(m, !0), c(function (i) {
                            r = a("LCP"), n = s(e, r, t), requestAnimationFrame(function () {
                                requestAnimationFrame(function () {
                                    r.value = performance.now() - i.timeStamp, S.add(r.id), n(!0)
                                })
                            })
                        })
                    }
                }, e.getTTFB = function (e) {
                    var t, n = a("TTFB");
                    t = function () {
                        try {
                            var t = performance.getEntriesByType("navigation")[0] || function () {
                                var e = performance.timing,
                                    t = {
                                        entryType: "navigation",
                                        startTime: 0
                                    };
                                for (var n in e) "navigationStart" !== n && "toJSON" !== n && (t[n] = Math.max(e[n] - e.navigationStart, 0));
                                return t
                            }();
                            if (n.value = n.delta = t.responseStart, n.value < 0) return;
                            n.entries = [t], e(n)
                        } catch (e) { }
                    }, "complete" === document.readyState ? setTimeout(t, 0) : addEventListener("pageshow", t)
                }, Object.defineProperty(e, "__esModule", {
                    value: !0
                })
            })
        }
    };
    var t = {};

    function __nccwpck_require__(n) {
        if (t[n]) {
            return t[n].exports
        }
        var i = t[n] = {
            exports: {}
        };
        var r = true;
        try {
            e[n].call(i.exports, i, i.exports, __nccwpck_require__);
            r = false
        } finally {
            if (r) delete t[n]
        }
        return i.exports
    }
    __nccwpck_require__.ab = __dirname + "/";
    return __nccwpck_require__(770)
}();