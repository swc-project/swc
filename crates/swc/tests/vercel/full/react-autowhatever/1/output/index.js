"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), exports.default = void 0;
var a, b = require("react/jsx-runtime"), c = function(a) {
    if (a && a.__esModule) return a;
    var b = {
    };
    if (null != a) {
        for(var b in a)if (Object.prototype.hasOwnProperty.call(a, b)) {
            var d = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(a, b) : {
            };
            d.get || d.set ? Object.defineProperty(b, b, d) : b[b] = a[b];
        }
    }
    return b.default = a, b;
}(require("react")), d = (a = require("prop-types")) && a.__esModule ? a : {
    default: a
};
function e(a, b) {
    for(var c = 0; c < b.length; c++){
        var d = b[c];
        d.enumerable = d.enumerable || !1, d.configurable = !0, "value" in d && (d.writable = !0), Object.defineProperty(a, d.key, d);
    }
}
function f(a, b, c) {
    return b in a ? Object.defineProperty(a, b, {
        value: c,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : a[b] = c, a;
}
function b(d) {
    return b = Object.setPrototypeOf ? Object.getPrototypeOf : function b(d) {
        return d.__proto__ || Object.getPrototypeOf(d);
    }, b(d);
}
function h(a) {
    for(var c = 1; c < arguments.length; c++){
        var d = null != arguments[c] ? arguments[c] : {
        }, e = Object.keys(d);
        "function" == typeof Object.getOwnPropertySymbols && (e = e.concat(Object.getOwnPropertySymbols(d).filter(function(a) {
            return Object.getOwnPropertyDescriptor(d, a).enumerable;
        }))), e.forEach(function(b) {
            f(a, b, d[b]);
        });
    }
    return a;
}
function c(d, e) {
    return c = Object.setPrototypeOf || function c(d, e) {
        return d.__proto__ = e, d;
    }, c(d, e);
}
var l = function(d) {
    "use strict";
    !function(a, b) {
        if ("function" != typeof b && null !== b) throw new TypeError("Super expression must either be null or a function");
        a.prototype = Object.create(b && b.prototype, {
            constructor: {
                value: a,
                writable: !0,
                configurable: !0
            }
        }), b && c(a, b);
    }(l, d);
    var b, g, i, k = function(c) {
        var d = function() {
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
            var a, a, f, g, h = b(c);
            if (d) {
                var i = b(this).constructor;
                g = Reflect.construct(h, arguments, i);
            } else g = h.apply(this, arguments);
            return a = this, (f = g) && ("object" == ((a = f) && "undefined" != typeof Symbol && a.constructor === Symbol ? "symbol" : typeof a) || "function" == typeof f) ? f : (function(a) {
                if (void 0 === a) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return a;
            })(a);
        };
    }(l);
    function l() {
        var a;
        return !function(a, b) {
            if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function");
        }(this, l), a = k.apply(this, arguments), a.storeHighlightedItemReference = function(b) {
            a.props.onHighlightedItemChange(null === b ? null : b.item);
        }, a;
    }
    return b = l, g = [
        {
            key: "shouldComponentUpdate",
            value: function(a) {
                return !0;
            }
        },
        {
            key: "render",
            value: function() {
                var a = this, c = this.props, d = c.items, e = c.itemProps, f = c.renderItem, g = c.renderItemData, i = c.sectionIndex, j = c.highlightedItemIndex, k = c.getItemId, l = c.theme, m = c.keyPrefix, n = null === i ? m : "".concat(m, "section-").concat(i, "-"), o = "function" == typeof e;
                return b.jsx("ul", h({
                    role: "listbox"
                }, l("".concat(n, "items-list"), "itemsList"), {
                    children: d.map(function(c, d) {
                        var m = d === j, p = "".concat(n, "item-").concat(d), q = o ? e({
                            sectionIndex: i,
                            itemIndex: d
                        }) : e, r = h({
                            id: k(i, d),
                            "aria-selected": m
                        }, l(p, "item", 0 === d && "itemFirst", m && "itemHighlighted"), q);
                        return m && (r.ref = a.storeHighlightedItemReference), b.jsx(Item, h({
                        }, r, {
                            sectionIndex: i,
                            isHighlighted: m,
                            itemIndex: d,
                            item: c,
                            renderItem: f,
                            renderItemData: g
                        }));
                    })
                }));
            }
        }
    ], e(b.prototype, g), i && e(b, i), l;
}(c.Component);
l.propTypes = {
    items: d.default.array.isRequired,
    itemProps: d.default.oneOfType([
        d.default.object,
        d.default.func
    ]),
    renderItem: d.default.func.isRequired,
    renderItemData: d.default.object.isRequired,
    sectionIndex: d.default.number,
    highlightedItemIndex: d.default.number,
    onHighlightedItemChange: d.default.func.isRequired,
    getItemId: d.default.func.isRequired,
    theme: d.default.func.isRequired,
    keyPrefix: d.default.string.isRequired
}, l.defaultProps = {
    sectionIndex: null
}, exports.default = l, new l();
