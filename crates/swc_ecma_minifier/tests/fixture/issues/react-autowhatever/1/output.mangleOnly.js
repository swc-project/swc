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
function c(e, t) {
    if (!(e instanceof t)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function f(e, t) {
    for(var r = 0; r < t.length; r++){
        var n = t[r];
        n.enumerable = n.enumerable || false;
        n.configurable = true;
        if ("value" in n) n.writable = true;
        Object.defineProperty(e, n.key, n);
    }
}
function a(e, t, r) {
    if (t) f(e.prototype, t);
    if (r) f(e, r);
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
function m(e, t) {
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
function p(e) {
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
    if (t && (b(t) === "object" || typeof t === "function")) {
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
var b = function(e) {
    return e && typeof Symbol !== "undefined" && e.constructor === Symbol ? "symbol" : typeof e;
};
var y = (function(t) {
    "use strict";
    m(r, t);
    function r() {
        c(this, r);
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
                var n = this.props, o = n.items, u = n.itemProps, c = n.renderItem, f = n.renderItemData, a = n.sectionIndex, s = n.highlightedItemIndex, l = n.getItemId, m = n.theme, d = n.keyPrefix;
                var h = a === null ? d : "".concat(d, "section-").concat(a, "-");
                var b = typeof u === "function";
                return e("ul", p({
                    role: "listbox"
                }, m("".concat(h, "items-list"), "itemsList"), {
                    children: o.map(function(t, n) {
                        var o = n === 0;
                        var d = n === s;
                        var y = "".concat(h, "item-").concat(n);
                        var g = b ? u({
                            sectionIndex: a,
                            itemIndex: n
                        }) : u;
                        var I = p({
                            id: l(a, n),
                            "aria-selected": d
                        }, m(y, "item", o && "itemFirst", d && "itemHighlighted"), g);
                        if (d) {
                            I.ref = r.storeHighlightedItemReference;
                        }
                        return e(i, p({}, I, {
                            sectionIndex: a,
                            isHighlighted: d,
                            itemIndex: n,
                            item: t,
                            renderItem: c,
                            renderItemData: f
                        }));
                    })
                }));
            }
        }, 
    ]);
    return r;
})(r);
y.propTypes = {
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
y.defaultProps = {
    sectionIndex: null
};
export { y as default };
