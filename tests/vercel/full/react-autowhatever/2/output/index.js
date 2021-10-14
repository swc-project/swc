"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), exports.default = void 0;
var a = require("react/jsx-runtime"), b = function(c) {
    if (c && c.__esModule) return c;
    var d = {
    };
    if (null != c) {
        for(var e in c)if (Object.prototype.hasOwnProperty.call(c, e)) {
            var f = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(c, e) : {
            };
            f.get || f.set ? Object.defineProperty(d, e, f) : d[e] = c[e];
        }
    }
    return d.default = c, d;
}(require("react"));
function g(h, i) {
    for(var j = 0; j < i.length; j++){
        var k = i[j];
        k.enumerable = k.enumerable || !1, k.configurable = !0, "value" in k && (k.writable = !0), Object.defineProperty(h, k.key, k);
    }
}
function l(c, e, m) {
    return e in c ? Object.defineProperty(c, e, {
        value: m,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : c[e] = m, c;
}
function n(o) {
    return n = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    }, n(o);
}
function p(h) {
    for(var j = 1; j < arguments.length; j++){
        var q = null != arguments[j] ? arguments[j] : {
        }, r = Object.keys(q);
        "function" == typeof Object.getOwnPropertySymbols && (r = r.concat(Object.getOwnPropertySymbols(q).filter(function(s) {
            return Object.getOwnPropertyDescriptor(q, s).enumerable;
        }))), r.forEach(function(e) {
            l(h, e, q[e]);
        });
    }
    return h;
}
function t(o, u) {
    return t = Object.setPrototypeOf || function _setPrototypeOf(o, u) {
        return o.__proto__ = u, o;
    }, t(o, u);
}
var v = function(w) {
    "use strict";
    var x, y, z;
    function v() {
        var A, B, C, c;
        return !function(D, x) {
            if (!(D instanceof x)) throw new TypeError("Cannot call a class as a function");
        }(this, v), B = this, C = n(v).apply(this, arguments), (A = C && ("object" == ((c = C) && "undefined" != typeof Symbol && c.constructor === Symbol ? "symbol" : typeof c) || "function" == typeof C) ? C : (function(B) {
            if (void 0 === B) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return B;
        })(B)).storeHighlightedItemReference = function(E) {
            A.props.onHighlightedItemChange(null === E ? null : E.item);
        }, A;
    }
    return !function(F, G) {
        if ("function" != typeof G && null !== G) throw new TypeError("Super expression must either be null or a function");
        F.prototype = Object.create(G && G.prototype, {
            constructor: {
                value: F,
                writable: !0,
                configurable: !0
            }
        }), G && t(F, G);
    }(v, w), x = v, y = [
        {
            key: "shouldComponentUpdate",
            value: function(H) {
                return compareObjects(H, this.props, [
                    "itemProps"
                ]);
            }
        },
        {
            key: "render",
            value: function() {
                var I = this, J = this.props, K = J.items, L = J.itemProps, M = J.renderItem, N = J.renderItemData, O = J.sectionIndex, P = J.highlightedItemIndex, Q = J.getItemId, R = J.theme, S = J.keyPrefix, T = null === O ? S : "".concat(S, "section-").concat(O, "-"), U = "function" == typeof L;
                return a.jsx("ul", p({
                    role: "listbox"
                }, R("".concat(T, "items-list"), "itemsList"), {
                    children: K.map(function(V, W) {
                        var X = W === P, Y = "".concat(T, "item-").concat(W), Z = U ? L({
                            sectionIndex: O,
                            itemIndex: W
                        }) : L, $ = p({
                            id: Q(O, W),
                            "aria-selected": X
                        }, R(Y, "item", 0 === W && "itemFirst", X && "itemHighlighted"), Z);
                        return X && ($.ref = I.storeHighlightedItemReference), a.jsx(Item, p({
                        }, $, {
                            sectionIndex: O,
                            isHighlighted: X,
                            itemIndex: W,
                            item: V,
                            renderItem: M,
                            renderItemData: N
                        }));
                    })
                }));
            }
        }
    ], g(x.prototype, y), z && g(x, z), v;
}(b.Component);
v.propTypes = {
    items: 500
}, v.defaultProps = {
    sectionIndex: null
}, exports.default = v, new v();
