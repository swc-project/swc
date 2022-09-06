(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [
        985
    ],
    {
        8551: function(e, t, r) {
            "use strict";
            var n;
            var u = r(566);
            function o(e, t) {
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
            function a(e) {
                for(var t = 1; t < arguments.length; t++){
                    var r = arguments[t] != null ? arguments[t] : {};
                    if (t % 2) {
                        o(Object(r), true).forEach(function(t) {
                            u(e, t, r[t]);
                        });
                    } else if (Object.getOwnPropertyDescriptors) {
                        Object.defineProperties(e, Object.getOwnPropertyDescriptors(r));
                    } else {
                        o(Object(r)).forEach(function(t) {
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
            var i = f(r(2735));
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
                    return i["default"].createElement(r, {
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
                    n = a(a({}, n), e);
                }
                n = a(a({}, n), t);
                if (n.loadableGenerated) {
                    n = a(a({}, n), n.loadableGenerated);
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
            var o = n["default"].createContext(null);
            t.LoadableContext = o;
            if (false) {}
        },
        880: function(e, t, r) {
            "use strict";
            var n = r(566);
            var u = r(4988);
            var o = r(9590);
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
                            n(e, t, r[t]);
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
                var o = true, a = false, i;
                return {
                    s: function t() {
                        r = e[Symbol.iterator]();
                    },
                    n: function e() {
                        var t = r.next();
                        o = t.done;
                        return t;
                    },
                    e: function e(t) {
                        a = true;
                        i = t;
                    },
                    f: function e() {
                        try {
                            if (!o && r["return"] != null) r["return"]();
                        } finally{
                            if (a) throw i;
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
            var c = y(r(2735));
            var d = r(4234);
            var p = r(8183);
            function y(e) {
                return e && e.__esModule ? e : {
                    default: e
                };
            }
            var b = [];
            var v = [];
            var h = false;
            function m(e) {
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
            function $(e) {
                return e && e.__esModule ? e["default"] : e;
            }
            function O(e, t) {
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
                        var t = new g(e, r);
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
                if (!h && true && typeof r.webpack === "function" && "function" === "function") {
                    var o = r.webpack();
                    v.push(function(e) {
                        var t = l(o), r;
                        try {
                            for(t.s(); !(r = t.n()).done;){
                                var n = r.value;
                                if (e.indexOf(n) !== -1) {
                                    return u();
                                }
                            }
                        } catch (a) {
                            t.e(a);
                        } finally{
                            t.f();
                        }
                    });
                }
                var a = function e(t, o) {
                    u();
                    var a = c["default"].useContext(p.LoadableContext);
                    var i = (0, d).useSubscription(n);
                    c["default"].useImperativeHandle(o, function() {
                        return {
                            retry: n.retry
                        };
                    }, []);
                    if (a && Array.isArray(r.modules)) {
                        r.modules.forEach(function(e) {
                            a(e);
                        });
                    }
                    return c["default"].useMemo(function() {
                        if (i.loading || i.error) {
                            return c["default"].createElement(r.loading, {
                                isLoading: i.loading,
                                pastDelay: i.pastDelay,
                                timedOut: i.timedOut,
                                error: i.error,
                                retry: n.retry
                            });
                        } else if (i.loaded) {
                            return c["default"].createElement($(i.loaded), t);
                        } else {
                            return null;
                        }
                    }, [
                        t,
                        i
                    ]);
                };
                a.preload = function() {
                    return u();
                };
                a.displayName = "LoadableComponent";
                return c["default"].forwardRef(a);
            }
            var g = (function() {
                function e(t, r) {
                    u(this, e);
                    this._loadFn = t;
                    this._opts = r;
                    this._callbacks = new Set();
                    this._delay = null;
                    this._timeout = null;
                    this.retry();
                }
                o(e, [
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
                            this._state = i(i({}, this._state), {}, {
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
            function w(e) {
                return O(m, e);
            }
            function j(e, t) {
                var r = [];
                while(e.length){
                    var n = e.pop();
                    r.push(n(t));
                }
                return Promise.all(r).then(function() {
                    if (e.length) {
                        return j(e, t);
                    }
                });
            }
            w.preloadAll = function() {
                return new Promise(function(e, t) {
                    j(b).then(e, t);
                });
            };
            w.preloadReady = function() {
                var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
                return new Promise(function(t) {
                    var r = function e() {
                        h = true;
                        return t();
                    };
                    j(v, e).then(r, r);
                });
            };
            if (true) {
                window.__NEXT_PRELOADREADY = w.preloadReady;
            }
            var P = w;
            t.default = P;
        },
        8584: function(e, t, r) {
            "use strict";
            r.r(t);
            var n = r(4652);
            var u = (0, n.default)(function() {
                return Promise.all([
                    r.e(774),
                    r.e(974), 
                ]).then(r.bind(r, 6974));
            }, {
                loadableGenerated: {
                    webpack: function e() {
                        return [
                            6974
                        ];
                    },
                    modules: [
                        "dynamic/ssr.js -> " + "../../components/hello1", 
                    ]
                }
            });
            t["default"] = u;
        },
        5006: function(e, t, r) {
            (window.__NEXT_P = window.__NEXT_P || []).push([
                "/dynamic/ssr",
                function() {
                    return r(8584);
                }, 
            ]);
        },
        4652: function(e, t, r) {
            e.exports = r(8551);
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
            return t(5006);
        });
        var r = e.O();
        _N_E = r;
    }, 
]);
