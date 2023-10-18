module.exports = (function t(e, r, c) {
    function i(a, l) {
        if (!r[a]) {
            if (!e[a]) {
                if (f) return f(a, !0);
                var s = Error("Cannot find module '" + a + "'");
                throw s.code = "MODULE_NOT_FOUND", s;
            }
            var p = r[a] = {
                exports: {}
            };
            e[a][0].call(p.exports, function(r) {
                return i(e[a][1][r] || r);
            }, p, p.exports, t, e, r, c);
        }
        return r[a].exports;
    }
    for(var f = void 0, a = 0; a < c.length; a++)i(c[a]);
    return i;
})({
    40: [
        function(e, r, c) {
            "use strict";
            function n(e) {
                return (n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                    return typeof e;
                } : function(e) {
                    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
                })(e);
            }
            function i(e, r) {
                for(var c = 0; c < r.length; c++){
                    var f = r[c];
                    f.enumerable = f.enumerable || !1, f.configurable = !0, "value" in f && (f.writable = !0), Object.defineProperty(e, f.key, f);
                }
            }
            function o(e, r) {
                return (o = Object.setPrototypeOf || function(e, r) {
                    return e.__proto__ = r, e;
                })(e, r);
            }
            function u(e) {
                return (u = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
                    return e.__proto__ || Object.getPrototypeOf(e);
                })(e);
            }
            var f = function(e) {
                !function(e, r) {
                    if ("function" != typeof r && null !== r) throw TypeError("Super expression must either be null or a function");
                    e.prototype = Object.create(r && r.prototype, {
                        constructor: {
                            value: e,
                            writable: !0,
                            configurable: !0
                        }
                    }), r && o(e, r);
                }(u, e);
                var r, c, f, a, l = (r = u, c = function() {
                    if ("u" < typeof Reflect || !Reflect.construct || Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Date.prototype.toString.call(Reflect.construct(Date, [], function() {})), !0;
                    } catch (e) {
                        return !1;
                    }
                }(), function() {
                    var e, f, a = u(r);
                    if (c) {
                        var l = u(this).constructor;
                        f = Reflect.construct(a, arguments, l);
                    } else f = a.apply(this, arguments);
                    return (e = f) && ("object" === n(e) || "function" == typeof e) ? e : function(e) {
                        if (void 0 === e) throw ReferenceError("this hasn't been initialised - super() hasn't been called");
                        return e;
                    }(this);
                });
                function u(e) {
                    var r;
                    return function(e, r) {
                        if (!(e instanceof r)) throw TypeError("Cannot call a class as a function");
                    }(this, u), (r = l.call(this))._model = e, r;
                }
                return i((f = u).prototype, [
                    {
                        key: "render",
                        value: function(e, r, c) {
                            (r === c[2] || "x:SizeWithCells" === this.tag && r === c[1]) && e.leafNode(this.tag);
                        }
                    },
                    {
                        key: "parseOpen",
                        value: function(e) {
                            return e.name === this.tag && (this.model = {}, this.model[this.tag] = !0, !0);
                        }
                    },
                    {
                        key: "parseText",
                        value: function() {}
                    },
                    {
                        key: "parseClose",
                        value: function() {
                            return !1;
                        }
                    },
                    {
                        key: "tag",
                        get: function() {
                            return this._model && this._model.tag;
                        }
                    }
                ]), a && i(f, a), u;
            }(e("../../base-xform"));
            r.exports = f;
        },
        {
            "../../base-xform": 31
        }
    ]
}, {}, [
    15
])(15);
