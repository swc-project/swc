"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), exports.default = void 0;
var a = require("react/jsx-runtime"), b = function(a) {
    if (a && a.__esModule) return a;
    var b = {};
    if (null != a) {
        for(var c in a)if (Object.prototype.hasOwnProperty.call(a, c)) {
            var d = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(a, c) : {};
            d.get || d.set ? Object.defineProperty(b, c, d) : b[c] = a[c];
        }
    }
    return b.default = a, b;
}(require("react")), c = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
}(require("prop-types"));
function d(a, b) {
    for(var c = 0; c < b.length; c++){
        var d = b[c];
        d.enumerable = d.enumerable || !1, d.configurable = !0, "value" in d && (d.writable = !0), Object.defineProperty(a, d.key, d);
    }
}
function e(a, c, d) {
    return c in a ? Object.defineProperty(a, c, {
        value: d,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : a[c] = d, a;
}
function f(a) {
    return f = Object.setPrototypeOf ? Object.getPrototypeOf : function f(a) {
        return a.__proto__ || Object.getPrototypeOf(a);
    }, f(a);
}
function g(a) {
    for(var c = 1; c < arguments.length; c++){
        var d = null != arguments[c] ? arguments[c] : {}, f = Object.keys(d);
        "function" == typeof Object.getOwnPropertySymbols && (f = f.concat(Object.getOwnPropertySymbols(d).filter(function(a) {
            return Object.getOwnPropertyDescriptor(d, a).enumerable;
        }))), f.forEach(function(c) {
            e(a, c, d[c]);
        });
    }
    return a;
}
function h(a, b) {
    return h = Object.setPrototypeOf || function h(a, b) {
        return a.__proto__ = b, a;
    }, h(a, b);
}
var i = function(b) {
    "use strict";
    !function(a, b) {
        if ("function" != typeof b && null !== b) throw new TypeError("Super expression must either be null or a function");
        a.prototype = Object.create(b && b.prototype, {
            constructor: {
                value: a,
                writable: !0,
                configurable: !0
            }
        }), b && h(a, b);
    }(i, b);
    var c, e, j, k, l, m = (k = i, l = function() {
        if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
        if (Reflect.construct.sham) return !1;
        if ("function" == typeof Proxy) return !0;
        try {
            return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0;
        } catch (a) {
            return !1;
        }
    }(), function() {
        var a, b, c, d, e = f(k);
        if (l) {
            var g = f(this).constructor;
            d = Reflect.construct(e, arguments, g);
        } else d = e.apply(this, arguments);
        return b = this, (c = d) && ("object" == ((a = c) && "undefined" != typeof Symbol && a.constructor === Symbol ? "symbol" : typeof a) || "function" == typeof c) ? c : (function(b) {
            if (void 0 === b) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return b;
        })(b);
    });
    function i() {
        var a;
        return !function(a, c) {
            if (!(a instanceof c)) throw new TypeError("Cannot call a class as a function");
        }(this, i), a = m.apply(this, arguments), a.storeHighlightedItemReference = function(b) {
            a.props.onHighlightedItemChange(null === b ? null : b.item);
        }, a;
    }
    return c = i, e = [
        {
            key: "shouldComponentUpdate",
            value: function(a) {
                return !0;
            }
        },
        {
            key: "render",
            value: function() {
                var b = this, c = this.props, d = c.items, e = c.itemProps, f = c.renderItem, h = c.renderItemData, i = c.sectionIndex, j = c.highlightedItemIndex, k = c.getItemId, l = c.theme, m = c.keyPrefix, n = null === i ? m : "".concat(m, "section-").concat(i, "-"), o = "function" == typeof e;
                return a.jsx("ul", g({
                    role: "listbox"
                }, l("".concat(n, "items-list"), "itemsList"), {
                    children: d.map(function(c, d) {
                        var m = d === j, p = "".concat(n, "item-").concat(d), q = o ? e({
                            sectionIndex: i,
                            itemIndex: d
                        }) : e, r = g({
                            id: k(i, d),
                            "aria-selected": m
                        }, l(p, "item", 0 === d && "itemFirst", m && "itemHighlighted"), q);
                        return m && (r.ref = b.storeHighlightedItemReference), a.jsx(Item, g({}, r, {
                            sectionIndex: i,
                            isHighlighted: m,
                            itemIndex: d,
                            item: c,
                            renderItem: f,
                            renderItemData: h
                        }));
                    })
                }));
            }
        }
    ], d(c.prototype, e), j && d(c, j), i;
}(b.Component);
i.propTypes = {
    items: c.default.array.isRequired,
    itemProps: c.default.oneOfType([
        c.default.object,
        c.default.func
    ]),
    renderItem: c.default.func.isRequired,
    renderItemData: c.default.object.isRequired,
    sectionIndex: c.default.number,
    highlightedItemIndex: c.default.number,
    onHighlightedItemChange: c.default.func.isRequired,
    getItemId: c.default.func.isRequired,
    theme: c.default.func.isRequired,
    keyPrefix: c.default.string.isRequired
}, i.defaultProps = {
    sectionIndex: null
}, exports.default = i, new i();
