"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), exports.default = void 0;
var d = require("react/jsx-runtime"), c = function(a) {
    if (a && a.__esModule) return a;
    var c = {};
    if (null != a) {
        for(var b in a)if (Object.prototype.hasOwnProperty.call(a, b)) {
            var d = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(a, b) : {};
            d.get || d.set ? Object.defineProperty(c, b, d) : c[b] = a[b];
        }
    }
    return c.default = a, c;
}(require("react")), a = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
}(require("prop-types"));
function e(d, c) {
    for(var b = 0; b < c.length; b++){
        var a = c[b];
        a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(d, a.key, a);
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
function g(a) {
    return g = Object.setPrototypeOf ? Object.getPrototypeOf : function g(a) {
        return a.__proto__ || Object.getPrototypeOf(a);
    }, g(a);
}
function h(d) {
    for(var b = 1; b < arguments.length; b++){
        var e = null != arguments[b] ? arguments[b] : {}, c = Object.keys(e);
        "function" == typeof Object.getOwnPropertySymbols && (c = c.concat(Object.getOwnPropertySymbols(e).filter(function(a) {
            return Object.getOwnPropertyDescriptor(e, a).enumerable;
        }))), c.forEach(function(b) {
            f(d, b, e[b]);
        });
    }
    return d;
}
function i(a, b) {
    return i = Object.setPrototypeOf || function i(a, b) {
        return a.__proto__ = b, a;
    }, i(a, b);
}
var b = function(l) {
    "use strict";
    !function(b, a) {
        if ("function" != typeof a && null !== a) throw new TypeError("Super expression must either be null or a function");
        b.prototype = Object.create(a && a.prototype, {
            constructor: {
                value: b,
                writable: !0,
                configurable: !0
            }
        }), a && i(b, a);
    }(b, l);
    var c, f, j, m, n, o = (m = b, n = function() {
        if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
        if (Reflect.construct.sham) return !1;
        if ("function" == typeof Proxy) return !0;
        try {
            return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0;
        } catch (a) {
            return !1;
        }
    }(), function() {
        var a, e, b, d, f = g(m);
        if (n) {
            var h = g(this).constructor;
            d = Reflect.construct(f, arguments, h);
        } else d = f.apply(this, arguments);
        return e = this, (b = d) && ("object" == ((a = b) && "undefined" != typeof Symbol && a.constructor === Symbol ? "symbol" : typeof a) || "function" == typeof b) ? b : (function(e) {
            if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return e;
        })(e);
    });
    function b() {
        var a;
        return !function(a, c) {
            if (!(a instanceof c)) throw new TypeError("Cannot call a class as a function");
        }(this, b), a = o.apply(this, arguments), a.storeHighlightedItemReference = function(b) {
            a.props.onHighlightedItemChange(null === b ? null : b.item);
        }, a;
    }
    return c = b, f = [
        {
            key: "shouldComponentUpdate",
            value: function(a) {
                return !0;
            }
        },
        {
            key: "render",
            value: function() {
                var j = this, a = this.props, e = a.items, f = a.itemProps, k = a.renderItem, l = a.renderItemData, b = a.sectionIndex, m = a.highlightedItemIndex, n = a.getItemId, g = a.theme, c = a.keyPrefix, i = null === b ? c : "".concat(c, "section-").concat(b, "-"), o = "function" == typeof f;
                return d.jsx("ul", h({
                    role: "listbox"
                }, g("".concat(i, "items-list"), "itemsList"), {
                    children: e.map(function(p, a) {
                        var c = a === m, q = "".concat(i, "item-").concat(a), r = o ? f({
                            sectionIndex: b,
                            itemIndex: a
                        }) : f, e = h({
                            id: n(b, a),
                            "aria-selected": c
                        }, g(q, "item", 0 === a && "itemFirst", c && "itemHighlighted"), r);
                        return c && (e.ref = j.storeHighlightedItemReference), d.jsx(Item, h({}, e, {
                            sectionIndex: b,
                            isHighlighted: c,
                            itemIndex: a,
                            item: p,
                            renderItem: k,
                            renderItemData: l
                        }));
                    })
                }));
            }
        }
    ], e(c.prototype, f), j && e(c, j), b;
}(c.Component);
exports.default = b, b.propTypes = {
    items: a.default.array.isRequired,
    itemProps: a.default.oneOfType([
        a.default.object,
        a.default.func
    ]),
    renderItem: a.default.func.isRequired,
    renderItemData: a.default.object.isRequired,
    sectionIndex: a.default.number,
    highlightedItemIndex: a.default.number,
    onHighlightedItemChange: a.default.func.isRequired,
    getItemId: a.default.func.isRequired,
    theme: a.default.func.isRequired,
    keyPrefix: a.default.string.isRequired
}, b.defaultProps = {
    sectionIndex: null
}, new b();
