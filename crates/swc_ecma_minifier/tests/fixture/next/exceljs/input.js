export default function (t, e, r) {
    "use strict";

    function n(t) {
        return (n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
            return typeof t
        } : function (t) {
            return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
        })(t)
    }

    function i(t, e) {
        for (var r = 0; r < e.length; r++) {
            var n = e[r];
            n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
        }
    }

    function o(t, e) {
        return (o = Object.setPrototypeOf || function (t, e) {
            return t.__proto__ = e, t
        })(t, e)
    }

    function a(t) {
        var e = function () {
            if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
            if (Reflect.construct.sham) return !1;
            if ("function" == typeof Proxy) return !0;
            try {
                return Date.prototype.toString.call(Reflect.construct(Date, [], (function () { }))), !0
            } catch (t) {
                return !1
            }
        }();
        return function () {
            var r, n = u(t);
            if (e) {
                var i = u(this).constructor;
                r = Reflect.construct(n, arguments, i)
            } else r = n.apply(this, arguments);
            return s(this, r)
        }
    }

    function s(t, e) {
        return !e || "object" !== n(e) && "function" != typeof e ? function (t) {
            if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return t
        }(t) : e
    }

    function u(t) {
        return (u = Object.setPrototypeOf ? Object.getPrototypeOf : function (t) {
            return t.__proto__ || Object.getPrototypeOf(t)
        })(t)
    }
    var c = function (t) {
        ! function (t, e) {
            if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
            t.prototype = Object.create(e && e.prototype, {
                constructor: {
                    value: t,
                    writable: !0,
                    configurable: !0
                }
            }), e && o(t, e)
        }(u, t);
        var e, r, n, s = a(u);

        function u(t) {
            var e;
            return function (t, e) {
                if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
            }(this, u), (e = s.call(this))._model = t, e
        }
        return e = u, (r = [{
            key: "render",
            value: function (t, e, r) {
                (e === r[2] || "x:SizeWithCells" === this.tag && e === r[1]) && t.leafNode(this.tag)
            }
        }, {
            key: "parseOpen",
            value: function (t) {
                switch (t.name) {
                    case this.tag:
                        return this.model = {}, this.model[this.tag] = !0, !0;
                    default:
                        return !1
                }
            }
        }, {
            key: "parseText",
            value: function () { }
        }, {
            key: "parseClose",
            value: function () {
                return !1
            }
        }, {
            key: "tag",
            get: function () {
                return this._model && this._model.tag
            }
        }]) && i(e.prototype, r), n && i(e, n), u
    }(t("../../base-xform"));
    e.exports = c
}, {
    "../../base-xform": 31
}