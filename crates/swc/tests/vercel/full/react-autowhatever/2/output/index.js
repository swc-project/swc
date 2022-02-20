"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), exports.default = void 0;
var c = require("react/jsx-runtime"), b = function(a) {
    if (a && a.__esModule) return a;
    var c = {};
    if (null != a) {
        for(var b in a)if (Object.prototype.hasOwnProperty.call(a, b)) {
            var d = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(a, b) : {};
            d.get || d.set ? Object.defineProperty(c, b, d) : c[b] = a[b];
        }
    }
    return c.default = a, c;
}(require("react"));
function d(d, c) {
    for(var b = 0; b < c.length; b++){
        var a = c[b];
        a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(d, a.key, a);
    }
}
function e(a, b, c) {
    return b in a ? Object.defineProperty(a, b, {
        value: c,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : a[b] = c, a;
}
function f(a) {
    return f = Object.setPrototypeOf ? Object.getPrototypeOf : function f(a) {
        return a.__proto__ || Object.getPrototypeOf(a);
    }, f(a);
}
function g(d) {
    for(var b = 1; b < arguments.length; b++){
        var f = null != arguments[b] ? arguments[b] : {}, c = Object.keys(f);
        "function" == typeof Object.getOwnPropertySymbols && (c = c.concat(Object.getOwnPropertySymbols(f).filter(function(a) {
            return Object.getOwnPropertyDescriptor(f, a).enumerable;
        }))), c.forEach(function(b) {
            e(d, b, f[b]);
        });
    }
    return d;
}
function h(a, b) {
    return h = Object.setPrototypeOf || function h(a, b) {
        return a.__proto__ = b, a;
    }, h(a, b);
}
var a = function(k) {
    "use strict";
    !function(b, a) {
        if ("function" != typeof a && null !== a) throw new TypeError("Super expression must either be null or a function");
        b.prototype = Object.create(a && a.prototype, {
            constructor: {
                value: b,
                writable: !0,
                configurable: !0
            }
        }), a && h(b, a);
    }(a, k);
    var b, e, i, l, m, n = (l = a, m = function() {
        if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
        if (Reflect.construct.sham) return !1;
        if ("function" == typeof Proxy) return !0;
        try {
            return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0;
        } catch (a) {
            return !1;
        }
    }(), function() {
        var a, e, b, d, g = f(l);
        if (m) {
            var h = f(this).constructor;
            d = Reflect.construct(g, arguments, h);
        } else d = g.apply(this, arguments);
        return e = this, (b = d) && ("object" == ((a = b) && "undefined" != typeof Symbol && a.constructor === Symbol ? "symbol" : typeof a) || "function" == typeof b) ? b : (function(e) {
            if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return e;
        })(e);
    });
    function a() {
        var c;
        return !function(a, b) {
            if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function");
        }(this, a), c = n.apply(this, arguments), c.storeHighlightedItemReference = function(a) {
            c.props.onHighlightedItemChange(null === a ? null : a.item);
        }, c;
    }
    return b = a, e = [
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
                var j = this, a = this.props, e = a.items, f = a.itemProps, k = a.renderItem, l = a.renderItemData, b = a.sectionIndex, m = a.highlightedItemIndex, n = a.getItemId, h = a.theme, d = a.keyPrefix, i = null === b ? d : "".concat(d, "section-").concat(b, "-"), o = "function" == typeof f;
                return c.jsx("ul", g({
                    role: "listbox"
                }, h("".concat(i, "items-list"), "itemsList"), {
                    children: e.map(function(p, a) {
                        var d = a === m, q = "".concat(i, "item-").concat(a), r = o ? f({
                            sectionIndex: b,
                            itemIndex: a
                        }) : f, e = g({
                            id: n(b, a),
                            "aria-selected": d
                        }, h(q, "item", 0 === a && "itemFirst", d && "itemHighlighted"), r);
                        return d && (e.ref = j.storeHighlightedItemReference), c.jsx(Item, g({}, e, {
                            sectionIndex: b,
                            isHighlighted: d,
                            itemIndex: a,
                            item: p,
                            renderItem: k,
                            renderItemData: l
                        }));
                    })
                }));
            }
        }
    ], d(b.prototype, e), i && d(b, i), a;
}(b.Component);
exports.default = a, a.propTypes = {
    items: 500
}, a.defaultProps = {
    sectionIndex: null
}, new a();
