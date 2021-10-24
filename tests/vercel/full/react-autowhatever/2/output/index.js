"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), exports.default = void 0;
var a = require("react/jsx-runtime"), b = function(g) {
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
}(require("react"));
function c(a, b) {
    for(var c = 0; c < b.length; c++){
        var d = b[c];
        d.enumerable = d.enumerable || !1, d.configurable = !0, "value" in d && (d.writable = !0), Object.defineProperty(a, d.key, d);
    }
}
function d(g, b, c) {
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
function f(a) {
    for(var c = 1; c < arguments.length; c++){
        var e = null != arguments[c] ? arguments[c] : {
        }, f = Object.keys(e);
        "function" == typeof Object.getOwnPropertySymbols && (f = f.concat(Object.getOwnPropertySymbols(e).filter(function(a) {
            return Object.getOwnPropertyDescriptor(e, a).enumerable;
        }))), f.forEach(function(b) {
            d(a, b, e[b]);
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
        var c, a, f, g;
        return !function(a, b) {
            if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function");
        }(this, j), a = this, f = b(j).apply(this, arguments), (c = f && ("object" == ((g = f) && "undefined" != typeof Symbol && g.constructor === Symbol ? "symbol" : typeof g) || "function" == typeof f) ? f : (function(a) {
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
    ], c(b.prototype, g), i && c(b, i), j;
}(b.Component);
j.propTypes = {
    items: 500
}, j.defaultProps = {
    sectionIndex: null
}, exports.default = j, new j();
