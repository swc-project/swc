import { jsx as a } from "react/jsx-runtime";
import b, { Component as c } from "react";
import d from "prop-types";
import e from "./Item";
import f from "./compareObjects";
function g(a) {
    if (a === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return a;
}
function h(a, b) {
    if (!(a instanceof b)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function i(a, b) {
    for(var c = 0; c < b.length; c++){
        var d = b[c];
        d.enumerable = d.enumerable || false;
        d.configurable = true;
        if ("value" in d) d.writable = true;
        Object.defineProperty(a, d.key, d);
    }
}
function j(a, b, c) {
    if (b) i(a.prototype, b);
    if (c) i(a, c);
    return a;
}
function k(a, b, c) {
    if (b in a) {
        Object.defineProperty(a, b, {
            value: c,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        a[b] = c;
    }
    return a;
}
function l(a) {
    l = Object.setPrototypeOf ? Object.getPrototypeOf : function a(b) {
        return b.__proto__ || Object.getPrototypeOf(b);
    };
    return l(a);
}
function m(a, b) {
    if (typeof b !== "function" && b !== null) {
        throw new TypeError("Super expression must either be null or a function");
    }
    a.prototype = Object.create(b && b.prototype, {
        constructor: {
            value: a,
            writable: true,
            configurable: true
        }
    });
    if (b) p(a, b);
}
function n(a) {
    for(var b = 1; b < arguments.length; b++){
        var c = arguments[b] != null ? arguments[b] : {};
        var d = Object.keys(c);
        if (typeof Object.getOwnPropertySymbols === "function") {
            d = d.concat(Object.getOwnPropertySymbols(c).filter(function(a) {
                return Object.getOwnPropertyDescriptor(c, a).enumerable;
            }));
        }
        d.forEach(function(b) {
            k(a, b, c[b]);
        });
    }
    return a;
}
function o(a, b) {
    if (b && (q(b) === "object" || typeof b === "function")) {
        return b;
    }
    return g(a);
}
function p(a, b) {
    p = Object.setPrototypeOf || function a(b, c) {
        b.__proto__ = c;
        return b;
    };
    return p(a, b);
}
var q = function(a) {
    return a && typeof Symbol !== "undefined" && a.constructor === Symbol ? "symbol" : typeof a;
};
var r = (function(b) {
    "use strict";
    m(c, b);
    function c() {
        h(this, c);
        var a;
        a = o(this, l(c).apply(this, arguments));
        a.storeHighlightedItemReference = function(b) {
            a.props.onHighlightedItemChange(b === null ? null : b.item);
        };
        return a;
    }
    j(c, [
        {
            key: "shouldComponentUpdate",
            value: function a(b) {
                return f(b, this.props, [
                    "itemProps"
                ]);
            }
        },
        {
            key: "render",
            value: function b() {
                var c = this;
                var d = this.props, f = d.items, g = d.itemProps, h = d.renderItem, i = d.renderItemData, j = d.sectionIndex, k = d.highlightedItemIndex, l = d.getItemId, m = d.theme, o = d.keyPrefix;
                var p = j === null ? o : "".concat(o, "section-").concat(j, "-");
                var q = typeof g === "function";
                return a("ul", n({
                    role: "listbox"
                }, m("".concat(p, "items-list"), "itemsList"), {
                    children: f.map(function(b, d) {
                        var f = d === 0;
                        var o = d === k;
                        var r = "".concat(p, "item-").concat(d);
                        var s = q ? g({
                            sectionIndex: j,
                            itemIndex: d
                        }) : g;
                        var t = n({
                            id: l(j, d),
                            "aria-selected": o
                        }, m(r, "item", f && "itemFirst", o && "itemHighlighted"), s);
                        if (o) {
                            t.ref = c.storeHighlightedItemReference;
                        }
                        return a(e, n({}, t, {
                            sectionIndex: j,
                            isHighlighted: o,
                            itemIndex: d,
                            item: b,
                            renderItem: h,
                            renderItemData: i
                        }));
                    })
                }));
            }
        }, 
    ]);
    return c;
})(c);
r.propTypes = {
    items: d.array.isRequired,
    itemProps: d.oneOfType([
        d.object,
        d.func
    ]),
    renderItem: d.func.isRequired,
    renderItemData: d.object.isRequired,
    sectionIndex: d.number,
    highlightedItemIndex: d.number,
    onHighlightedItemChange: d.func.isRequired,
    getItemId: d.func.isRequired,
    theme: d.func.isRequired,
    keyPrefix: d.string.isRequired
};
r.defaultProps = {
    sectionIndex: null
};
export { r as default };
