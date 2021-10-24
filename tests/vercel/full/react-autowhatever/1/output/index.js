"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), exports.default = void 0;
var g, b = require("react/jsx-runtime"), c = function(g) {
    if (g && g.__esModule) return g;
    var b = {
    };
    if (null != g) {
        for(var b in g)if (Object.prototype.hasOwnProperty.call(g, b)) {
            var d = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(g, b) : {
            };
            d.get || d.set ? Object.defineProperty(b, b, d) : b[b] = g[b];
        }
    }
    return b.default = g, b;
}(require("react")), d = (g = require("prop-types")) && g.__esModule ? g : {
    default: g
};
function e(a, b) {
    for(var c = 0; c < b.length; c++){
        var d = b[c];
        d.enumerable = d.enumerable || !1, d.configurable = !0, "value" in d && (d.writable = !0), Object.defineProperty(a, d.key, d);
    }
}
function f(g, b, c) {
    return b in g ? Object.defineProperty(g, b, {
        value: c,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : g[b] = c, g;
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
var j = function(d) {
    "use strict";
    var b, g, i;
    function j() {
        var c, a, e, g;
        return !function(a, b) {
            if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function");
        }(this, j), a = this, e = b(j).apply(this, arguments), (c = e && ("object" == ((g = e) && "undefined" != typeof Symbol && g.constructor === Symbol ? "symbol" : typeof g) || "function" == typeof e) ? e : (function(a) {
            if (void 0 === a) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return a;
        })(a)).storeHighlightedItemReference = function(a) {
            c.props.onHighlightedItemChange(null === a ? null : a.item);
        }, c;
    }
    return !function(a, b) {
        if ("function" != typeof b && null !== b) throw new TypeError("Super expression must either be null or a function");
        a.prototype = Object.create(b && b.prototype, {
            constructor: {
                value: a,
                writable: !0,
                configurable: !0
            }
        }), b && c(a, b);
    }(j, d), b = j, g = [
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
    ], e(b.prototype, g), i && e(b, i), j;
}(c.Component);
j.propTypes = {
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
}, j.defaultProps = {
    sectionIndex: null
}, exports.default = j, new j();
