(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [
        732
    ],
    {
        2911: function(a, b, c) {
            "use strict";
            c.d(b, {
                Z: function() {
                    return d;
                }
            });
            function d(a) {
                if (a === void 0) {
                    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                }
                return a;
            }
        },
        8436: function(a, b, c) {
            "use strict";
            c.d(b, {
                Z: function() {
                    return d;
                }
            });
            function d(a, b) {
                if (!(a instanceof b)) {
                    throw new TypeError("Cannot call a class as a function");
                }
            }
        },
        8370: function(a, b, c) {
            "use strict";
            c.d(b, {
                Z: function() {
                    return e;
                }
            });
            function d(a, b) {
                for(var c = 0; c < b.length; c++){
                    var d = b[c];
                    d.enumerable = d.enumerable || false;
                    d.configurable = true;
                    if ("value" in d) d.writable = true;
                    Object.defineProperty(a, d.key, d);
                }
            }
            function e(a, b, c) {
                if (b) d(a.prototype, b);
                if (c) d(a, c);
                return a;
            }
        },
        9178: function(a, b, c) {
            "use strict";
            c.d(b, {
                Z: function() {
                    return d;
                }
            });
            function d(a, b, c) {
                if (b in a) {
                    Object.defineProperty(a, b, {
                        value: c,
                        enumerable: true,
                        configurable: true,
                        writable: true
                    });
                } else {
                    a[b] = c;
                }
                return a;
            }
        },
        2374: function(a, b, c) {
            "use strict";
            c.d(b, {
                Z: function() {
                    return d;
                }
            });
            function d(a) {
                d = Object.setPrototypeOf ? Object.getPrototypeOf : function a(b) {
                    return b.__proto__ || Object.getPrototypeOf(b);
                };
                return d(a);
            }
        },
        3001: function(a, b, c) {
            "use strict";
            c.d(b, {
                Z: function() {
                    return e;
                }
            });
            function d(a, b) {
                d = Object.setPrototypeOf || function a(b, c) {
                    b.__proto__ = c;
                    return b;
                };
                return d(a, b);
            }
            function e(a, b) {
                if (typeof b !== "function" && b !== null) {
                    throw new TypeError("Super expression must either be null or a function");
                }
                a.prototype = Object.create(b && b.prototype, {
                    constructor: {
                        value: a,
                        writable: true,
                        configurable: true
                    }
                });
                if (b) d(a, b);
            }
        },
        7130: function(a, b, c) {
            "use strict";
            c.d(b, {
                Z: function() {
                    return f;
                }
            });
            function d(a) {
                "@babel/helpers - typeof";
                if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
                    d = function a(b) {
                        return typeof b;
                    };
                } else {
                    d = function a(b) {
                        return b && typeof Symbol === "function" && b.constructor === Symbol && b !== Symbol.prototype ? "symbol" : typeof b;
                    };
                }
                return d(a);
            }
            var e = c(2911);
            function f(a, b) {
                if (b && (d(b) === "object" || typeof b === "function")) {
                    return b;
                }
                return (0, e.Z)(a);
            }
        },
        8551: function(a, b, c) {
            "use strict";
            var d;
            var e = c(566);
            function f(a, b) {
                var c = Object.keys(a);
                if (Object.getOwnPropertySymbols) {
                    var d = Object.getOwnPropertySymbols(a);
                    if (b) d = d.filter(function(b) {
                        return Object.getOwnPropertyDescriptor(a, b).enumerable;
                    });
                    c.push.apply(c, d);
                }
                return c;
            }
            function g(a) {
                for(var b = 1; b < arguments.length; b++){
                    var c = arguments[b] != null ? arguments[b] : {};
                    if (b % 2) {
                        f(Object(c), true).forEach(function(b) {
                            e(a, b, c[b]);
                        });
                    } else if (Object.getOwnPropertyDescriptors) {
                        Object.defineProperties(a, Object.getOwnPropertyDescriptors(c));
                    } else {
                        f(Object(c)).forEach(function(b) {
                            Object.defineProperty(a, b, Object.getOwnPropertyDescriptor(c, b));
                        });
                    }
                }
                return a;
            }
            d = {
                value: true
            };
            d = l;
            b.default = m;
            var h = j(c(2735));
            var i = j(c(880));
            function j(a) {
                return a && a.__esModule ? a : {
                    default: a
                };
            }
            var k = false;
            function l(a, b) {
                delete b.webpack;
                delete b.modules;
                if (!k) {
                    return a(b);
                }
                var c = b.loading;
                return function() {
                    return h["default"].createElement(c, {
                        error: null,
                        isLoading: true,
                        pastDelay: false,
                        timedOut: false
                    });
                };
            }
            function m(a, b) {
                var c = i["default"];
                var d = {
                    loading: function a(b) {
                        var c = b.error, d = b.isLoading, e = b.pastDelay;
                        if (!e) return null;
                        if (false) {}
                        return null;
                    }
                };
                if (a instanceof Promise) {
                    d.loader = function() {
                        return a;
                    };
                } else if (typeof a === "function") {
                    d.loader = a;
                } else if (typeof a === "object") {
                    d = g(g({}, d), a);
                }
                d = g(g({}, d), b);
                if (d.loadableGenerated) {
                    d = g(g({}, d), d.loadableGenerated);
                    delete d.loadableGenerated;
                }
                if (typeof d.ssr === "boolean") {
                    if (!d.ssr) {
                        delete d.ssr;
                        return l(c, d);
                    }
                    delete d.ssr;
                }
                return c(d);
            }
        },
        8183: function(a, b, c) {
            "use strict";
            Object.defineProperty(b, "__esModule", {
                value: true
            });
            b.LoadableContext = void 0;
            var d = e(c(2735));
            function e(a) {
                return a && a.__esModule ? a : {
                    default: a
                };
            }
            var f = d["default"].createContext(null);
            b.LoadableContext = f;
            if (false) {}
        },
        880: function(a, b, c) {
            "use strict";
            var d = c(566);
            var e = c(4988);
            var f = c(9590);
            function g(a, b) {
                var c = Object.keys(a);
                if (Object.getOwnPropertySymbols) {
                    var d = Object.getOwnPropertySymbols(a);
                    if (b) d = d.filter(function(b) {
                        return Object.getOwnPropertyDescriptor(a, b).enumerable;
                    });
                    c.push.apply(c, d);
                }
                return c;
            }
            function h(a) {
                for(var b = 1; b < arguments.length; b++){
                    var c = arguments[b] != null ? arguments[b] : {};
                    if (b % 2) {
                        g(Object(c), true).forEach(function(b) {
                            d(a, b, c[b]);
                        });
                    } else if (Object.getOwnPropertyDescriptors) {
                        Object.defineProperties(a, Object.getOwnPropertyDescriptors(c));
                    } else {
                        g(Object(c)).forEach(function(b) {
                            Object.defineProperty(a, b, Object.getOwnPropertyDescriptor(c, b));
                        });
                    }
                }
                return a;
            }
            function i(a, b) {
                var c;
                if (typeof Symbol === "undefined" || a[Symbol.iterator] == null) {
                    if (Array.isArray(a) || (c = j(a)) || (b && a && typeof a.length === "number")) {
                        if (c) a = c;
                        var d = 0;
                        var e = function a() {};
                        return {
                            s: e,
                            n: function b() {
                                if (d >= a.length) return {
                                    done: true
                                };
                                return {
                                    done: false,
                                    value: a[d++]
                                };
                            },
                            e: function a(b) {
                                throw b;
                            },
                            f: e
                        };
                    }
                    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
                }
                var f = true, g = false, h;
                return {
                    s: function b() {
                        c = a[Symbol.iterator]();
                    },
                    n: function a() {
                        var b = c.next();
                        f = b.done;
                        return b;
                    },
                    e: function a(b) {
                        g = true;
                        h = b;
                    },
                    f: function a() {
                        try {
                            if (!f && c["return"] != null) c["return"]();
                        } finally{
                            if (g) throw h;
                        }
                    }
                };
            }
            function j(a, b) {
                if (!a) return;
                if (typeof a === "string") return k(a, b);
                var c = Object.prototype.toString.call(a).slice(8, -1);
                if (c === "Object" && a.constructor) c = a.constructor.name;
                if (c === "Map" || c === "Set") return Array.from(a);
                if (c === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(c)) return k(a, b);
            }
            function k(a, b) {
                if (b == null || b > a.length) b = a.length;
                for(var c = 0, d = new Array(b); c < b; c++){
                    d[c] = a[c];
                }
                return d;
            }
            Object.defineProperty(b, "__esModule", {
                value: true
            });
            b.default = void 0;
            var l = o(c(2735));
            var m = c(4234);
            var n = c(8183);
            function o(a) {
                return a && a.__esModule ? a : {
                    default: a
                };
            }
            var p = [];
            var q = [];
            var r = false;
            function s(a) {
                var b = a();
                var c = {
                    loading: true,
                    loaded: null,
                    error: null
                };
                c.promise = b.then(function(a) {
                    c.loading = false;
                    c.loaded = a;
                    return a;
                })["catch"](function(a) {
                    c.loading = false;
                    c.error = a;
                    throw a;
                });
                return c;
            }
            function t(a) {
                return a && a.__esModule ? a["default"] : a;
            }
            function u(a, b) {
                var c = Object.assign({
                    loader: null,
                    loading: null,
                    delay: 200,
                    timeout: null,
                    webpack: null,
                    modules: null
                }, b);
                var d = null;
                function e() {
                    if (!d) {
                        var b = new v(a, c);
                        d = {
                            getCurrentValue: b.getCurrentValue.bind(b),
                            subscribe: b.subscribe.bind(b),
                            retry: b.retry.bind(b),
                            promise: b.promise.bind(b)
                        };
                    }
                    return d.promise();
                }
                if (false) {}
                if (!r && true && typeof c.webpack === "function" && "function" === "function") {
                    var f = c.webpack();
                    q.push(function(a) {
                        var b = i(f), c;
                        try {
                            for(b.s(); !(c = b.n()).done;){
                                var d = c.value;
                                if (a.indexOf(d) !== -1) {
                                    return e();
                                }
                            }
                        } catch (g) {
                            b.e(g);
                        } finally{
                            b.f();
                        }
                    });
                }
                var g = function a(b, f) {
                    e();
                    var g = l["default"].useContext(n.LoadableContext);
                    var h = (0, m).useSubscription(d);
                    l["default"].useImperativeHandle(f, function() {
                        return {
                            retry: d.retry
                        };
                    }, []);
                    if (g && Array.isArray(c.modules)) {
                        c.modules.forEach(function(a) {
                            g(a);
                        });
                    }
                    return l["default"].useMemo(function() {
                        if (h.loading || h.error) {
                            return l["default"].createElement(c.loading, {
                                isLoading: h.loading,
                                pastDelay: h.pastDelay,
                                timedOut: h.timedOut,
                                error: h.error,
                                retry: d.retry
                            });
                        } else if (h.loaded) {
                            return l["default"].createElement(t(h.loaded), b);
                        } else {
                            return null;
                        }
                    }, [
                        b,
                        h
                    ]);
                };
                g.preload = function() {
                    return e();
                };
                g.displayName = "LoadableComponent";
                return l["default"].forwardRef(g);
            }
            var v = (function() {
                function a(b, c) {
                    e(this, a);
                    this._loadFn = b;
                    this._opts = c;
                    this._callbacks = new Set();
                    this._delay = null;
                    this._timeout = null;
                    this.retry();
                }
                f(a, [
                    {
                        key: "promise",
                        value: function a() {
                            return this._res.promise;
                        }
                    },
                    {
                        key: "retry",
                        value: function a() {
                            var b = this;
                            this._clearTimeouts();
                            this._res = this._loadFn(this._opts.loader);
                            this._state = {
                                pastDelay: false,
                                timedOut: false
                            };
                            var c = this._res, d = this._opts;
                            if (c.loading) {
                                if (typeof d.delay === "number") {
                                    if (d.delay === 0) {
                                        this._state.pastDelay = true;
                                    } else {
                                        this._delay = setTimeout(function() {
                                            b._update({
                                                pastDelay: true
                                            });
                                        }, d.delay);
                                    }
                                }
                                if (typeof d.timeout === "number") {
                                    this._timeout = setTimeout(function() {
                                        b._update({
                                            timedOut: true
                                        });
                                    }, d.timeout);
                                }
                            }
                            this._res.promise.then(function() {
                                b._update({});
                                b._clearTimeouts();
                            })["catch"](function(a) {
                                b._update({});
                                b._clearTimeouts();
                            });
                            this._update({});
                        }
                    },
                    {
                        key: "_update",
                        value: function a(b) {
                            this._state = h(h({}, this._state), {}, {
                                error: this._res.error,
                                loaded: this._res.loaded,
                                loading: this._res.loading
                            }, b);
                            this._callbacks.forEach(function(a) {
                                return a();
                            });
                        }
                    },
                    {
                        key: "_clearTimeouts",
                        value: function a() {
                            clearTimeout(this._delay);
                            clearTimeout(this._timeout);
                        }
                    },
                    {
                        key: "getCurrentValue",
                        value: function a() {
                            return this._state;
                        }
                    },
                    {
                        key: "subscribe",
                        value: function a(b) {
                            var c = this;
                            this._callbacks.add(b);
                            return function() {
                                c._callbacks["delete"](b);
                            };
                        }
                    }, 
                ]);
                return a;
            })();
            function w(a) {
                return u(s, a);
            }
            function x(a, b) {
                var c = [];
                while(a.length){
                    var d = a.pop();
                    c.push(d(b));
                }
                return Promise.all(c).then(function() {
                    if (a.length) {
                        return x(a, b);
                    }
                });
            }
            w.preloadAll = function() {
                return new Promise(function(a, b) {
                    x(p).then(a, b);
                });
            };
            w.preloadReady = function() {
                var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
                return new Promise(function(b) {
                    var c = function a() {
                        r = true;
                        return b();
                    };
                    x(q, a).then(c, c);
                });
            };
            if (true) {
                window.__NEXT_PRELOADREADY = w.preloadReady;
            }
            var y = w;
            b.default = y;
        },
        9087: function(a, b, c) {
            "use strict";
            c.r(b);
            c.d(b, {
                default: function() {
                    return o;
                }
            });
            var d = c(4512);
            var e = c(8436);
            var f = c(8370);
            var g = c(2911);
            var h = c(3001);
            var i = c(7130);
            var j = c(2374);
            var k = c(9178);
            var l = c(2735);
            function m(a) {
                var b = n();
                return function c() {
                    var d = (0, j.Z)(a), e;
                    if (b) {
                        var f = (0, j.Z)(this).constructor;
                        e = Reflect.construct(d, arguments, f);
                    } else {
                        e = d.apply(this, arguments);
                    }
                    return (0, i.Z)(this, e);
                };
            }
            function n() {
                if (typeof Reflect === "undefined" || !Reflect.construct) return false;
                if (Reflect.construct.sham) return false;
                if (typeof Proxy === "function") return true;
                try {
                    Date.prototype.toString.call(Reflect.construct(Date, [], function() {}));
                    return true;
                } catch (a) {
                    return false;
                }
            }
            var o = (function(a) {
                (0, h.Z)(c, a);
                var b = m(c);
                function c() {
                    var a;
                    (0, e.Z)(this, c);
                    for(var d = arguments.length, f = new Array(d), h = 0; h < d; h++){
                        f[h] = arguments[h];
                    }
                    a = b.call.apply(b, [
                        this
                    ].concat(f));
                    (0, k.Z)((0, g.Z)(a), "state", {
                        name: null
                    });
                    return a;
                }
                (0, f.Z)(c, [
                    {
                        key: "componentDidMount",
                        value: function a() {
                            var b = this.props.name;
                            this.setState({
                                name: b
                            });
                        }
                    },
                    {
                        key: "render",
                        value: function a() {
                            var b = this.state.name;
                            if (!b) return null;
                            return (0, d.jsxs)("p", {
                                children: [
                                    "Welcome, ",
                                    b
                                ]
                            });
                        }
                    }, 
                ]);
                return c;
            })(l.Component);
        },
        8837: function(a, b, c) {
            "use strict";
            c.r(b);
            var d = c(4512);
            var e = c(4652);
            var f = c(9087);
            var g = (0, e.default)(function() {
                return Promise.resolve().then(c.bind(c, 9087));
            }, {
                loadableGenerated: {
                    webpack: function a() {
                        return [
                            9087
                        ];
                    },
                    modules: [
                        "dynamic/no-chunk.js -> " + "../../components/welcome", 
                    ]
                }
            });
            b["default"] = function() {
                return (0, d.jsxs)("div", {
                    children: [
                        (0, d.jsx)(f.default, {
                            name: "normal"
                        }),
                        (0, d.jsx)(g, {
                            name: "dynamic"
                        }), 
                    ]
                });
            };
        },
        5279: function(a, b, c) {
            (window.__NEXT_P = window.__NEXT_P || []).push([
                "/dynamic/no-chunk",
                function() {
                    return c(8837);
                }, 
            ]);
        },
        4652: function(a, b, c) {
            a.exports = c(8551);
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
            return b(5279);
        });
        var c = a.O();
        _N_E = c;
    }, 
]);
