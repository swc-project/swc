(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [
        732
    ],
    {
        2911: function(e, t, r) {
            "use strict";
            r.d(t, {
                Z: function() {
                    return n;
                }
            });
            function n(e) {
                if (e === void 0) {
                    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                }
                return e;
            }
        },
        8436: function(e, t, r) {
            "use strict";
            r.d(t, {
                Z: function() {
                    return n;
                }
            });
            function n(e, t) {
                if (!(e instanceof t)) {
                    throw new TypeError("Cannot call a class as a function");
                }
            }
        },
        8370: function(e, t, r) {
            "use strict";
            r.d(t, {
                Z: function() {
                    return u;
                }
            });
            function n(e, t) {
                for(var r = 0; r < t.length; r++){
                    var n = t[r];
                    n.enumerable = n.enumerable || false;
                    n.configurable = true;
                    if ("value" in n) n.writable = true;
                    Object.defineProperty(e, n.key, n);
                }
            }
            function u(e, t, r) {
                if (t) n(e.prototype, t);
                if (r) n(e, r);
                return e;
            }
        },
        9178: function(e, t, r) {
            "use strict";
            r.d(t, {
                Z: function() {
                    return n;
                }
            });
            function n(e, t, r) {
                if (t in e) {
                    Object.defineProperty(e, t, {
                        value: r,
                        enumerable: true,
                        configurable: true,
                        writable: true
                    });
                } else {
                    e[t] = r;
                }
                return e;
            }
        },
        2374: function(e, t, r) {
            "use strict";
            r.d(t, {
                Z: function() {
                    return n;
                }
            });
            function n(e) {
                n = Object.setPrototypeOf ? Object.getPrototypeOf : function e(t) {
                    return t.__proto__ || Object.getPrototypeOf(t);
                };
                return n(e);
            }
        },
        3001: function(e, t, r) {
            "use strict";
            r.d(t, {
                Z: function() {
                    return u;
                }
            });
            function n(e, t) {
                n = Object.setPrototypeOf || function e(t, r) {
                    t.__proto__ = r;
                    return t;
                };
                return n(e, t);
            }
            function u(e, t) {
                if (typeof t !== "function" && t !== null) {
                    throw new TypeError("Super expression must either be null or a function");
                }
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        writable: true,
                        configurable: true
                    }
                });
                if (t) n(e, t);
            }
        },
        7130: function(e, t, r) {
            "use strict";
            r.d(t, {
                Z: function() {
                    return o;
                }
            });
            function n(e) {
                "@babel/helpers - typeof";
                if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
                    n = function e(t) {
                        return typeof t;
                    };
                } else {
                    n = function e(t) {
                        return t && typeof Symbol === "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
                    };
                }
                return n(e);
            }
            var u = r(2911);
            function o(e, t) {
                if (t && (n(t) === "object" || typeof t === "function")) {
                    return t;
                }
                return (0, u.Z)(e);
            }
        },
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
            function i(e) {
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
            var a = l(r(2735));
            var f = l(r(880));
            function l(e) {
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
                    return a["default"].createElement(r, {
                        error: null,
                        isLoading: true,
                        pastDelay: false,
                        timedOut: false
                    });
                };
            }
            function d(e, t) {
                var r = f["default"];
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
            var o = n["default"].createContext(null);
            t.LoadableContext = o;
            if (false) {}
        },
        880: function(e, t, r) {
            "use strict";
            var n = r(566);
            var u = r(4988);
            var o = r(9590);
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
            function a(e) {
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
            function f(e, t) {
                var r;
                if (typeof Symbol === "undefined" || e[Symbol.iterator] == null) {
                    if (Array.isArray(e) || (r = l(e)) || (t && e && typeof e.length === "number")) {
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
                var o = true, i = false, a;
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
                        i = true;
                        a = t;
                    },
                    f: function e() {
                        try {
                            if (!o && r["return"] != null) r["return"]();
                        } finally{
                            if (i) throw a;
                        }
                    }
                };
            }
            function l(e, t) {
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
            function $(e, t) {
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
                        var t = new w(e, r);
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
                    var o = r.webpack();
                    h.push(function(e) {
                        var t = f(o), r;
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
                var i = function e(t, o) {
                    u();
                    var i = c["default"].useContext(p.LoadableContext);
                    var a = (0, d).useSubscription(n);
                    c["default"].useImperativeHandle(o, function() {
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
                        if (a.loading || a.error) {
                            return c["default"].createElement(r.loading, {
                                isLoading: a.loading,
                                pastDelay: a.pastDelay,
                                timedOut: a.timedOut,
                                error: a.error,
                                retry: n.retry
                            });
                        } else if (a.loaded) {
                            return c["default"].createElement(g(a.loaded), t);
                        } else {
                            return null;
                        }
                    }, [
                        t,
                        a
                    ]);
                };
                i.preload = function() {
                    return u();
                };
                i.displayName = "LoadableComponent";
                return c["default"].forwardRef(i);
            }
            var w = (function() {
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
                            this._state = a(a({}, this._state), {}, {
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
            function P(e) {
                return $(b, e);
            }
            function k(e, t) {
                var r = [];
                while(e.length){
                    var n = e.pop();
                    r.push(n(t));
                }
                return Promise.all(r).then(function() {
                    if (e.length) {
                        return k(e, t);
                    }
                });
            }
            P.preloadAll = function() {
                return new Promise(function(e, t) {
                    k(y).then(e, t);
                });
            };
            P.preloadReady = function() {
                var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
                return new Promise(function(t) {
                    var r = function e() {
                        m = true;
                        return t();
                    };
                    k(h, e).then(r, r);
                });
            };
            if (true) {
                window.__NEXT_PRELOADREADY = P.preloadReady;
            }
            var O = P;
            t.default = O;
        },
        9087: function(e, t, r) {
            "use strict";
            r.r(t);
            r.d(t, {
                default: function() {
                    return v;
                }
            });
            var n = r(4512);
            var u = r(8436);
            var o = r(8370);
            var i = r(2911);
            var a = r(3001);
            var f = r(7130);
            var l = r(2374);
            var s = r(9178);
            var c = r(2735);
            function d(e) {
                var t = p();
                return function r() {
                    var n = (0, l.Z)(e), u;
                    if (t) {
                        var o = (0, l.Z)(this).constructor;
                        u = Reflect.construct(n, arguments, o);
                    } else {
                        u = n.apply(this, arguments);
                    }
                    return (0, f.Z)(this, u);
                };
            }
            function p() {
                if (typeof Reflect === "undefined" || !Reflect.construct) return false;
                if (Reflect.construct.sham) return false;
                if (typeof Proxy === "function") return true;
                try {
                    Date.prototype.toString.call(Reflect.construct(Date, [], function() {}));
                    return true;
                } catch (e) {
                    return false;
                }
            }
            var v = (function(e) {
                (0, a.Z)(r, e);
                var t = d(r);
                function r() {
                    var e;
                    (0, u.Z)(this, r);
                    for(var n = arguments.length, o = new Array(n), a = 0; a < n; a++){
                        o[a] = arguments[a];
                    }
                    e = t.call.apply(t, [
                        this
                    ].concat(o));
                    (0, s.Z)((0, i.Z)(e), "state", {
                        name: null
                    });
                    return e;
                }
                (0, o.Z)(r, [
                    {
                        key: "componentDidMount",
                        value: function e() {
                            var t = this.props.name;
                            this.setState({
                                name: t
                            });
                        }
                    },
                    {
                        key: "render",
                        value: function e() {
                            var t = this.state.name;
                            if (!t) return null;
                            return (0, n.jsxs)("p", {
                                children: [
                                    "Welcome, ",
                                    t
                                ]
                            });
                        }
                    }, 
                ]);
                return r;
            })(c.Component);
        },
        8837: function(e, t, r) {
            "use strict";
            r.r(t);
            var n = r(4512);
            var u = r(4652);
            var o = r(9087);
            var i = (0, u.default)(function() {
                return Promise.resolve().then(r.bind(r, 9087));
            }, {
                loadableGenerated: {
                    webpack: function e() {
                        return [
                            9087
                        ];
                    },
                    modules: [
                        "dynamic/no-chunk.js -> " + "../../components/welcome", 
                    ]
                }
            });
            t["default"] = function() {
                return (0, n.jsxs)("div", {
                    children: [
                        (0, n.jsx)(o.default, {
                            name: "normal"
                        }),
                        (0, n.jsx)(i, {
                            name: "dynamic"
                        }), 
                    ]
                });
            };
        },
        5279: function(e, t, r) {
            (window.__NEXT_P = window.__NEXT_P || []).push([
                "/dynamic/no-chunk",
                function() {
                    return r(8837);
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
            return t(5279);
        });
        var r = e.O();
        _N_E = r;
    }, 
]);
