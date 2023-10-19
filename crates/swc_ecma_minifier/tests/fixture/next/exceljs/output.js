module.exports = (function t(e, r, c) {
    function i(l, p) {
        if (!r[l]) {
            if (!e[l]) {
                if (f) return f(l, !0);
                var y = Error("Cannot find module '" + l + "'");
                throw y.code = "MODULE_NOT_FOUND", y;
            }
            var h = r[l] = {
                exports: {}
            };
            e[l][0].call(h.exports, function(r) {
                return i(e[l][1][r] || r);
            }, h, h.exports, t, e, r, c);
        }
        return r[l].exports;
    }
    for(var f = void 0, l = 0; l < c.length; l++)i(c[l]);
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
            function a(e) {
                var r = function() {
                    if ("undefined" == typeof Reflect || !Reflect.construct || Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Date.prototype.toString.call(Reflect.construct(Date, [], function() {})), !0;
                    } catch (e) {
                        return !1;
                    }
                }();
                return function() {
                    var c, f = u(e);
                    if (r) {
                        var l = u(this).constructor;
                        c = Reflect.construct(f, arguments, l);
                    } else c = f.apply(this, arguments);
                    return s(this, c);
                };
            }
            function s(e, r) {
                return r && ("object" === n(r) || "function" == typeof r) ? r : function(e) {
                    if (void 0 === e) throw ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return e;
                }(e);
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
                var r, c, f = a(u);
                function u(e) {
                    var r;
                    return function(e, r) {
                        if (!(e instanceof r)) throw TypeError("Cannot call a class as a function");
                    }(this, u), (r = f.call(this))._model = e, r;
                }
                return i((r = u).prototype, [
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
                ]), c && i(r, c), u;
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
