(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [
        499
    ],
    {
        6086: function(e, t, r) {
            "use strict";
            r.d(t, {
                Z: function() {
                    return u;
                }
            });
            function n(e, t, r, n, u, a, i) {
                try {
                    var o = e[a](i);
                    var l = o.value;
                } catch (f) {
                    r(f);
                    return;
                }
                if (o.done) {
                    t(l);
                } else {
                    Promise.resolve(l).then(n, u);
                }
            }
            function u(e) {
                return function() {
                    var t = this, r = arguments;
                    return new Promise(function(u, a) {
                        var i = e.apply(t, r);
                        function o(e) {
                            n(i, u, a, o, l, "next", e);
                        }
                        function l(e) {
                            n(i, u, a, o, l, "throw", e);
                        }
                        o(undefined);
                    });
                };
            }
        },
        8551: function(e, t, r) {
            "use strict";
            var n;
            var u = r(566);
            function a(e, t) {
                var r = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var n = Object.getOwnPropertySymbols(e);
                    if (t) n = n.filter(function(t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable;
                    });
                    r.push.apply(r, n);
                }
                return r;
            }
            function i(e) {
                for(var t = 1; t < arguments.length; t++){
                    var r = arguments[t] != null ? arguments[t] : {};
                    if (t % 2) {
                        a(Object(r), true).forEach(function(t) {
                            u(e, t, r[t]);
                        });
                    } else if (Object.getOwnPropertyDescriptors) {
                        Object.defineProperties(e, Object.getOwnPropertyDescriptors(r));
                    } else {
                        a(Object(r)).forEach(function(t) {
                            Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
                        });
                    }
                }
                return e;
            }
            n = {
                value: true
            };
            n = c;
            t.default = d;
            var o = f(r(2735));
            var l = f(r(880));
            function f(e) {
                return e && e.__esModule ? e : {
                    default: e
                };
            }
            var s = false;
            function c(e, t) {
                delete t.webpack;
                delete t.modules;
                if (!s) {
                    return e(t);
                }
                var r = t.loading;
                return function() {
                    return o["default"].createElement(r, {
                        error: null,
                        isLoading: true,
                        pastDelay: false,
                        timedOut: false
                    });
                };
            }
            function d(e, t) {
                var r = l["default"];
                var n = {
                    loading: function e(t) {
                        var r = t.error, n = t.isLoading, u = t.pastDelay;
                        if (!u) return null;
                        if (false) {}
                        return null;
                    }
                };
                if (e instanceof Promise) {
                    n.loader = function() {
                        return e;
                    };
                } else if (typeof e === "function") {
                    n.loader = e;
                } else if (typeof e === "object") {
                    n = i(i({}, n), e);
                }
                n = i(i({}, n), t);
                if (n.loadableGenerated) {
                    n = i(i({}, n), n.loadableGenerated);
                    delete n.loadableGenerated;
                }
                if (typeof n.ssr === "boolean") {
                    if (!n.ssr) {
                        delete n.ssr;
                        return c(r, n);
                    }
                    delete n.ssr;
                }
                return r(n);
            }
        },
        8183: function(e, t, r) {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.LoadableContext = void 0;
            var n = u(r(2735));
            function u(e) {
                return e && e.__esModule ? e : {
                    default: e
                };
            }
            var a = n["default"].createContext(null);
            t.LoadableContext = a;
            if (false) {}
        },
        880: function(e, t, r) {
            "use strict";
            var n = r(566);
            var u = r(4988);
            var a = r(9590);
            function i(e, t) {
                var r = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var n = Object.getOwnPropertySymbols(e);
                    if (t) n = n.filter(function(t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable;
                    });
                    r.push.apply(r, n);
                }
                return r;
            }
            function o(e) {
                for(var t = 1; t < arguments.length; t++){
                    var r = arguments[t] != null ? arguments[t] : {};
                    if (t % 2) {
                        i(Object(r), true).forEach(function(t) {
                            n(e, t, r[t]);
                        });
                    } else if (Object.getOwnPropertyDescriptors) {
                        Object.defineProperties(e, Object.getOwnPropertyDescriptors(r));
                    } else {
                        i(Object(r)).forEach(function(t) {
                            Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
                        });
                    }
                }
                return e;
            }
            function l(e, t) {
                var r;
                if (typeof Symbol === "undefined" || e[Symbol.iterator] == null) {
                    if (Array.isArray(e) || (r = f(e)) || (t && e && typeof e.length === "number")) {
                        if (r) e = r;
                        var n = 0;
                        var u = function e() {};
                        return {
                            s: u,
                            n: function t() {
                                if (n >= e.length) return {
                                    done: true
                                };
                                return {
                                    done: false,
                                    value: e[n++]
                                };
                            },
                            e: function e(t) {
                                throw t;
                            },
                            f: u
                        };
                    }
                    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
                }
                var a = true, i = false, o;
                return {
                    s: function t() {
                        r = e[Symbol.iterator]();
                    },
                    n: function e() {
                        var t = r.next();
                        a = t.done;
                        return t;
                    },
                    e: function e(t) {
                        i = true;
                        o = t;
                    },
                    f: function e() {
                        try {
                            if (!a && r["return"] != null) r["return"]();
                        } finally{
                            if (i) throw o;
                        }
                    }
                };
            }
            function f(e, t) {
                if (!e) return;
                if (typeof e === "string") return s(e, t);
                var r = Object.prototype.toString.call(e).slice(8, -1);
                if (r === "Object" && e.constructor) r = e.constructor.name;
                if (r === "Map" || r === "Set") return Array.from(e);
                if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return s(e, t);
            }
            function s(e, t) {
                if (t == null || t > e.length) t = e.length;
                for(var r = 0, n = new Array(t); r < t; r++){
                    n[r] = e[r];
                }
                return n;
            }
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.default = void 0;
            var c = v(r(2735));
            var d = r(4234);
            var p = r(8183);
            function v(e) {
                return e && e.__esModule ? e : {
                    default: e
                };
            }
            var y = [];
            var h = [];
            var m = false;
            function b(e) {
                var t = e();
                var r = {
                    loading: true,
                    loaded: null,
                    error: null
                };
                r.promise = t.then(function(e) {
                    r.loading = false;
                    r.loaded = e;
                    return e;
                })["catch"](function(e) {
                    r.loading = false;
                    r.error = e;
                    throw e;
                });
                return r;
            }
            function g(e) {
                return e && e.__esModule ? e["default"] : e;
            }
            function w(e, t) {
                var r = Object.assign({
                    loader: null,
                    loading: null,
                    delay: 200,
                    timeout: null,
                    webpack: null,
                    modules: null
                }, t);
                var n = null;
                function u() {
                    if (!n) {
                        var t = new $(e, r);
                        n = {
                            getCurrentValue: t.getCurrentValue.bind(t),
                            subscribe: t.subscribe.bind(t),
                            retry: t.retry.bind(t),
                            promise: t.promise.bind(t)
                        };
                    }
                    return n.promise();
                }
                if (false) {}
                if (!m && true && typeof r.webpack === "function" && "function" === "function") {
                    var a = r.webpack();
                    h.push(function(e) {
                        var t = l(a), r;
                        try {
                            for(t.s(); !(r = t.n()).done;){
                                var n = r.value;
                                if (e.indexOf(n) !== -1) {
                                    return u();
                                }
                            }
                        } catch (i) {
                            t.e(i);
                        } finally{
                            t.f();
                        }
                    });
                }
                var i = function e(t, a) {
                    u();
                    var i = c["default"].useContext(p.LoadableContext);
                    var o = (0, d).useSubscription(n);
                    c["default"].useImperativeHandle(a, function() {
                        return {
                            retry: n.retry
                        };
                    }, []);
                    if (i && Array.isArray(r.modules)) {
                        r.modules.forEach(function(e) {
                            i(e);
                        });
                    }
                    return c["default"].useMemo(function() {
                        if (o.loading || o.error) {
                            return c["default"].createElement(r.loading, {
                                isLoading: o.loading,
                                pastDelay: o.pastDelay,
                                timedOut: o.timedOut,
                                error: o.error,
                                retry: n.retry
                            });
                        } else if (o.loaded) {
                            return c["default"].createElement(g(o.loaded), t);
                        } else {
                            return null;
                        }
                    }, [
                        t,
                        o
                    ]);
                };
                i.preload = function() {
                    return u();
                };
                i.displayName = "LoadableComponent";
                return c["default"].forwardRef(i);
            }
            var $ = (function() {
                function e(t, r) {
                    u(this, e);
                    this._loadFn = t;
                    this._opts = r;
                    this._callbacks = new Set();
                    this._delay = null;
                    this._timeout = null;
                    this.retry();
                }
                a(e, [
                    {
                        key: "promise",
                        value: function e() {
                            return this._res.promise;
                        }
                    },
                    {
                        key: "retry",
                        value: function e() {
                            var t = this;
                            this._clearTimeouts();
                            this._res = this._loadFn(this._opts.loader);
                            this._state = {
                                pastDelay: false,
                                timedOut: false
                            };
                            var r = this._res, n = this._opts;
                            if (r.loading) {
                                if (typeof n.delay === "number") {
                                    if (n.delay === 0) {
                                        this._state.pastDelay = true;
                                    } else {
                                        this._delay = setTimeout(function() {
                                            t._update({
                                                pastDelay: true
                                            });
                                        }, n.delay);
                                    }
                                }
                                if (typeof n.timeout === "number") {
                                    this._timeout = setTimeout(function() {
                                        t._update({
                                            timedOut: true
                                        });
                                    }, n.timeout);
                                }
                            }
                            this._res.promise.then(function() {
                                t._update({});
                                t._clearTimeouts();
                            })["catch"](function(e) {
                                t._update({});
                                t._clearTimeouts();
                            });
                            this._update({});
                        }
                    },
                    {
                        key: "_update",
                        value: function e(t) {
                            this._state = o(o({}, this._state), {}, {
                                error: this._res.error,
                                loaded: this._res.loaded,
                                loading: this._res.loading
                            }, t);
                            this._callbacks.forEach(function(e) {
                                return e();
                            });
                        }
                    },
                    {
                        key: "_clearTimeouts",
                        value: function e() {
                            clearTimeout(this._delay);
                            clearTimeout(this._timeout);
                        }
                    },
                    {
                        key: "getCurrentValue",
                        value: function e() {
                            return this._state;
                        }
                    },
                    {
                        key: "subscribe",
                        value: function e(t) {
                            var r = this;
                            this._callbacks.add(t);
                            return function() {
                                r._callbacks["delete"](t);
                            };
                        }
                    }, 
                ]);
                return e;
            })();
            function k(e) {
                return w(b, e);
            }
            function O(e, t) {
                var r = [];
                while(e.length){
                    var n = e.pop();
                    r.push(n(t));
                }
                return Promise.all(r).then(function() {
                    if (e.length) {
                        return O(e, t);
                    }
                });
            }
            k.preloadAll = function() {
                return new Promise(function(e, t) {
                    O(y).then(e, t);
                });
            };
            k.preloadReady = function() {
                var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
                return new Promise(function(t) {
                    var r = function e() {
                        m = true;
                        return t();
                    };
                    O(h, e).then(r, r);
                });
            };
            if (true) {
                window.__NEXT_PRELOADREADY = k.preloadReady;
            }
            var P = k;
            t.default = P;
        },
        1804: function(e, t, r) {
            "use strict";
            r.r(t);
            var n = r(7945);
            var u = r.n(n);
            var a = r(4512);
            var i = r(6086);
            var o = r(4652);
            var l = r(1843);
            var f = (0, o.default)({
                loader: (function() {
                    var e = (0, i.Z)(u().mark(function e() {
                        return u().wrap(function e(t) {
                            while(1){
                                switch((t.prev = t.next)){
                                    case 0:
                                        return t.abrupt("return", function() {
                                            return (0, a.jsxs)("div", {
                                                className: "dynamic-style",
                                                children: [
                                                    (0, a.jsx)(l.default, {
                                                        children: (0, a.jsx)("style", {
                                                            dangerouslySetInnerHTML: {
                                                                __html: "\n            .dynamic-style {\n              background-color: green;\n              height: 200px;\n            }\n          "
                                                            }
                                                        })
                                                    }),
                                                    "test", 
                                                ]
                                            });
                                        });
                                    case 1:
                                    case "end":
                                        return t.stop();
                                }
                            }
                        }, e);
                    }));
                    function t() {
                        return e.apply(this, arguments);
                    }
                    return t;
                })(),
                ssr: false
            });
            t["default"] = f;
        },
        2250: function(e, t, r) {
            (window.__NEXT_P = window.__NEXT_P || []).push([
                "/dynamic/head",
                function() {
                    return r(1804);
                }, 
            ]);
        },
        4652: function(e, t, r) {
            e.exports = r(8551);
        },
        1843: function(e, t, r) {
            e.exports = r(3396);
        }
    },
    function(e) {
        var t = function(t) {
            return e((e.s = t));
        };
        e.O(0, [
            774,
            888,
            179
        ], function() {
            return t(2250);
        });
        var r = e.O();
        _N_E = r;
    }, 
]);
