"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), exports.default = void 0;
var a = require("react/jsx-runtime"), b = function(a) {
    if (a && a.__esModule) return a;
    var b = {
    };
    if (null != a) {
        for(var c in a)if (Object.prototype.hasOwnProperty.call(a, c)) {
            var d = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(a, c) : {
            };
            d.get || d.set ? Object.defineProperty(b, c, d) : b[c] = a[c];
        }
    }
    return b.default = a, b;
}(require("react"));
function c(a, b) {
    for(var c = 0; c < b.length; c++){
        var d = b[c];
        d.enumerable = d.enumerable || !1, d.configurable = !0, "value" in d && (d.writable = !0), Object.defineProperty(a, d.key, d);
    }
}
function d(a, c, d) {
    return c in a ? Object.defineProperty(a, c, {
        value: d,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : a[c] = d, a;
}
function e(a) {
    return e = Object.setPrototypeOf ? Object.getPrototypeOf : function e(a) {
        return a.__proto__ || Object.getPrototypeOf(a);
    }, e(a);
}
function f(a) {
    for(var c = 1; c < arguments.length; c++){
        var e = null != arguments[c] ? arguments[c] : {
        }, f = Object.keys(e);
        "function" == typeof Object.getOwnPropertySymbols && (f = f.concat(Object.getOwnPropertySymbols(e).filter(function(a) {
            return Object.getOwnPropertyDescriptor(e, a).enumerable;
        }))), f.forEach(function(c) {
            d(a, c, e[c]);
        });
    }
    return a;
}
function g(a, b) {
    return g = Object.setPrototypeOf || function g(a, b) {
        return a.__proto__ = b, a;
    }, g(a, b);
}
var h = function(b) {
    "use strict";
    !function(a, b) {
        if ("function" != typeof b && null !== b) throw new TypeError("Super expression must either be null or a function");
        a.prototype = Object.create(b && b.prototype, {
            constructor: {
                value: a,
                writable: !0,
                configurable: !0
            }
        }), b && g(a, b);
    }(h, b);
    var d, i, j, k = function(b) {
        var c = function() {
            if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
            if (Reflect.construct.sham) return !1;
            if ("function" == typeof Proxy) return !0;
            try {
                return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
                })), !0;
            } catch (a) {
                return !1;
            }
        }();
        return function() {
            var a, d, f, g, h = e(b);
            if (c) {
                var i = e(this).constructor;
                g = Reflect.construct(h, arguments, i);
            } else g = h.apply(this, arguments);
            return d = this, (f = g) && ("object" == ((a = f) && "undefined" != typeof Symbol && a.constructor === Symbol ? "symbol" : typeof a) || "function" == typeof f) ? f : (function(d) {
                if (void 0 === d) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return d;
            })(d);
        };
    }(h);
    function h() {
        var a;
        return !function(a, d) {
            if (!(a instanceof d)) throw new TypeError("Cannot call a class as a function");
        }(this, h), a = k.apply(this, arguments), a.storeHighlightedItemReference = function(b) {
            a.props.onHighlightedItemChange(null === b ? null : b.item);
        }, a;
    }
    return d = h, i = [
        {
            key: "shouldComponentUpdate",
            value: function(a) {
                return compareObjects(a, this.props, [
                    "itemProps"
                ]);
            }
        },
        {
            key: "render",
            value: function() {
                var b = this, c = this.props, d = c.items, e = c.itemProps, g = c.renderItem, h = c.renderItemData, i = c.sectionIndex, j = c.highlightedItemIndex, k = c.getItemId, l = c.theme, m = c.keyPrefix, n = null === i ? m : "".concat(m, "section-").concat(i, "-"), o = "function" == typeof e;
                return a.jsx("ul", f({
                    role: "listbox"
                }, l("".concat(n, "items-list"), "itemsList"), {
                    children: d.map(function(c, d) {
                        var m = d === j, p = "".concat(n, "item-").concat(d), q = o ? e({
                            sectionIndex: i,
                            itemIndex: d
                        }) : e, r = f({
                            id: k(i, d),
                            "aria-selected": m
                        }, l(p, "item", 0 === d && "itemFirst", m && "itemHighlighted"), q);
                        return m && (r.ref = b.storeHighlightedItemReference), a.jsx(Item, f({
                        }, r, {
                            sectionIndex: i,
                            isHighlighted: m,
                            itemIndex: d,
                            item: c,
                            renderItem: g,
                            renderItemData: h
                        }));
                    })
                }));
            }
        }
    ], c(d.prototype, i), j && c(d, j), h;
}(b.Component);
h.propTypes = {
    items: 500
}, h.defaultProps = {
    sectionIndex: null
}, exports.default = h, new h();
