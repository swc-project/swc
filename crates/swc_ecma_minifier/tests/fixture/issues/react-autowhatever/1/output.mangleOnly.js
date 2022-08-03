import { jsx as e } from "react/jsx-runtime";
import t, { Component as r } from "react";
import n from "prop-types";
import i from "./Item";
import o from "./compareObjects";
function u(e) {
    if (e === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return e;
}
function f(e, t) {
    if (!(e instanceof t)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function c(e, t) {
    for(var r = 0; r < t.length; r++){
        var n = t[r];
        n.enumerable = n.enumerable || false;
        n.configurable = true;
        if ("value" in n) n.writable = true;
        Object.defineProperty(e, n.key, n);
    }
}
function a(e, t, r) {
    if (t) c(e.prototype, t);
    if (r) c(e, r);
    return e;
}
function s(e, t, r) {
    if (t in e) {
        Object.defineProperty(e, t, {
            value: r,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        e[t] = r;
    }
    return e;
}
function l(e) {
    l = Object.setPrototypeOf ? Object.getPrototypeOf : function e(t) {
        return t.__proto__ || Object.getPrototypeOf(t);
    };
    return l(e);
}
function p(e, t) {
    if (typeof t !== "function" && t !== null) {
        throw new TypeError("Super expression must either be null or a function");
    }
    e.prototype = Object.create(t && t.prototype, {
        constructor: {
            value: e,
            writable: true,
            configurable: true
        }
    });
    if (t) h(e, t);
}
function m(e) {
    for(var t = 1; t < arguments.length; t++){
        var r = arguments[t] != null ? arguments[t] : {};
        var n = Object.keys(r);
        if (typeof Object.getOwnPropertySymbols === "function") {
            n = n.concat(Object.getOwnPropertySymbols(r).filter(function(e) {
                return Object.getOwnPropertyDescriptor(r, e).enumerable;
            }));
        }
        n.forEach(function(t) {
            s(e, t, r[t]);
        });
    }
    return e;
}
function d(e, t) {
    if (t && (y(t) === "object" || typeof t === "function")) {
        return t;
    }
    return u(e);
}
function h(e, t) {
    h = Object.setPrototypeOf || function e(t, r) {
        t.__proto__ = r;
        return t;
    };
    return h(e, t);
}
var y = function(e) {
    return e && typeof Symbol !== "undefined" && e.constructor === Symbol ? "symbol" : typeof e;
};
var g = (function(t) {
    "use strict";
    p(r, t);
    function r() {
        f(this, r);
        var e;
        e = d(this, l(r).apply(this, arguments));
        e.storeHighlightedItemReference = function(t) {
            e.props.onHighlightedItemChange(t === null ? null : t.item);
        };
        return e;
    }
    a(r, [
        {
            key: "shouldComponentUpdate",
            value: function e(t) {
                return o(t, this.props, [
                    "itemProps"
                ]);
            }
        },
        {
            key: "render",
            value: function t() {
                var r = this;
                var n = this.props, o = n.items, u = n.itemProps, f = n.renderItem, c = n.renderItemData, a = n.sectionIndex, s = n.highlightedItemIndex, l = n.getItemId, p = n.theme, d = n.keyPrefix;
                var h = a === null ? d : "".concat(d, "section-").concat(a, "-");
                var y = typeof u === "function";
                return e("ul", m({
                    role: "listbox"
                }, p("".concat(h, "items-list"), "itemsList"), {
                    children: o.map(function(t, n) {
                        var o = n === 0;
                        var d = n === s;
                        var g = "".concat(h, "item-").concat(n);
                        var I = y ? u({
                            sectionIndex: a,
                            itemIndex: n
                        }) : u;
                        var v = m({
                            id: l(a, n),
                            "aria-selected": d
                        }, p(g, "item", o && "itemFirst", d && "itemHighlighted"), I);
                        if (d) {
                            v.ref = r.storeHighlightedItemReference;
                        }
                        return e(i, m({}, v, {
                            sectionIndex: a,
                            isHighlighted: d,
                            itemIndex: n,
                            item: t,
                            renderItem: f,
                            renderItemData: c
                        }));
                    })
                }));
            }
        }, 
    ]);
    return r;
})(r);
g.propTypes = {
    items: n.array.isRequired,
    itemProps: n.oneOfType([
        n.object,
        n.func
    ]),
    renderItem: n.func.isRequired,
    renderItemData: n.object.isRequired,
    sectionIndex: n.number,
    highlightedItemIndex: n.number,
    onHighlightedItemChange: n.func.isRequired,
    getItemId: n.func.isRequired,
    theme: n.func.isRequired,
    keyPrefix: n.string.isRequired
};
g.defaultProps = {
    sectionIndex: null
};
export { g as default };
