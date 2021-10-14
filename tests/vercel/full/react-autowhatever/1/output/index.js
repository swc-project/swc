"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), exports.default = void 0;
var a, b = require("react/jsx-runtime"), c = function(a) {
    if (a && a.__esModule) return a;
    var d = {
    };
    if (null != a) {
        for(var e in a)if (Object.prototype.hasOwnProperty.call(a, e)) {
            var f = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(a, e) : {
            };
            f.get || f.set ? Object.defineProperty(d, e, f) : d[e] = a[e];
        }
    }
    return d.default = a, d;
}(require("react")), g = (a = require("prop-types")) && a.__esModule ? a : {
    default: a
};
function h(i, j) {
    for(var k = 0; k < j.length; k++){
        var l = j[k];
        l.enumerable = l.enumerable || !1, l.configurable = !0, "value" in l && (l.writable = !0), Object.defineProperty(i, l.key, l);
    }
}
function m(a, e, n) {
    return e in a ? Object.defineProperty(a, e, {
        value: n,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : a[e] = n, a;
}
function o(p) {
    return o = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(p) {
        return p.__proto__ || Object.getPrototypeOf(p);
    }, o(p);
}
function q(i) {
    for(var k = 1; k < arguments.length; k++){
        var r = null != arguments[k] ? arguments[k] : {
        }, s = Object.keys(r);
        "function" == typeof Object.getOwnPropertySymbols && (s = s.concat(Object.getOwnPropertySymbols(r).filter(function(t) {
            return Object.getOwnPropertyDescriptor(r, t).enumerable;
        }))), s.forEach(function(e) {
            m(i, e, r[e]);
        });
    }
    return i;
}
function u(p, v) {
    return u = Object.setPrototypeOf || function _setPrototypeOf(p, v) {
        return p.__proto__ = v, p;
    }, u(p, v);
}
var w = function(x) {
    "use strict";
    var y, z, A;
    function w() {
        var B, C, D, a;
        return !function(E, y) {
            if (!(E instanceof y)) throw new TypeError("Cannot call a class as a function");
        }(this, w), C = this, D = o(w).apply(this, arguments), (B = D && ("object" == ((a = D) && "undefined" != typeof Symbol && a.constructor === Symbol ? "symbol" : typeof a) || "function" == typeof D) ? D : (function(C) {
            if (void 0 === C) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return C;
        })(C)).storeHighlightedItemReference = function(F) {
            B.props.onHighlightedItemChange(null === F ? null : F.item);
        }, B;
    }
    return !function(G, H) {
        if ("function" != typeof H && null !== H) throw new TypeError("Super expression must either be null or a function");
        G.prototype = Object.create(H && H.prototype, {
            constructor: {
                value: G,
                writable: !0,
                configurable: !0
            }
        }), H && u(G, H);
    }(w, x), y = w, z = [
        {
            key: "shouldComponentUpdate",
            value: function(I) {
                return !0;
            }
        },
        {
            key: "render",
            value: function() {
                var J = this, K = this.props, L = K.items, M = K.itemProps, N = K.renderItem, O = K.renderItemData, P = K.sectionIndex, Q = K.highlightedItemIndex, R = K.getItemId, S = K.theme, T = K.keyPrefix, U = null === P ? T : "".concat(T, "section-").concat(P, "-"), V = "function" == typeof M;
                return b.jsx("ul", q({
                    role: "listbox"
                }, S("".concat(U, "items-list"), "itemsList"), {
                    children: L.map(function(W, X) {
                        var Y = X === Q, Z = "".concat(U, "item-").concat(X), $ = V ? M({
                            sectionIndex: P,
                            itemIndex: X
                        }) : M, _ = q({
                            id: R(P, X),
                            "aria-selected": Y
                        }, S(Z, "item", 0 === X && "itemFirst", Y && "itemHighlighted"), $);
                        return Y && (_.ref = J.storeHighlightedItemReference), b.jsx(Item, q({
                        }, _, {
                            sectionIndex: P,
                            isHighlighted: Y,
                            itemIndex: X,
                            item: W,
                            renderItem: N,
                            renderItemData: O
                        }));
                    })
                }));
            }
        }
    ], h(y.prototype, z), A && h(y, A), w;
}(c.Component);
w.propTypes = {
    items: g.default.array.isRequired,
    itemProps: g.default.oneOfType([
        g.default.object,
        g.default.func
    ]),
    renderItem: g.default.func.isRequired,
    renderItemData: g.default.object.isRequired,
    sectionIndex: g.default.number,
    highlightedItemIndex: g.default.number,
    onHighlightedItemChange: g.default.func.isRequired,
    getItemId: g.default.func.isRequired,
    theme: g.default.func.isRequired,
    keyPrefix: g.default.string.isRequired
}, w.defaultProps = {
    sectionIndex: null
}, exports.default = w, new w();
