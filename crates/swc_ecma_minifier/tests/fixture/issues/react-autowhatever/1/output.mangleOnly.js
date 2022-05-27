import { jsx as d } from "react/jsx-runtime";
import e, { Component as c } from "react";
import a from "prop-types";
import f from "./Item";
import g from "./compareObjects";
function h(a) {
    if (a === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return a;
}
function i(a, b) {
    if (!(a instanceof b)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function j(d, c) {
    for(var b = 0; b < c.length; b++){
        var a = c[b];
        a.enumerable = a.enumerable || false;
        a.configurable = true;
        if ("value" in a) a.writable = true;
        Object.defineProperty(d, a.key, a);
    }
}
function k(a, b, c) {
    if (b) j(a.prototype, b);
    if (c) j(a, c);
    return a;
}
function l(a, b, c) {
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
function m(a) {
    m = Object.setPrototypeOf ? Object.getPrototypeOf : function b(a) {
        return a.__proto__ || Object.getPrototypeOf(a);
    };
    return m(a);
}
function n(b, a) {
    if (typeof a !== "function" && a !== null) {
        throw new TypeError("Super expression must either be null or a function");
    }
    b.prototype = Object.create(a && a.prototype, {
        constructor: {
            value: b,
            writable: true,
            configurable: true
        }
    });
    if (a) q(b, a);
}
function o(d) {
    for(var a = 1; a < arguments.length; a++){
        var c = arguments[a] != null ? arguments[a] : {};
        var b = Object.keys(c);
        if (typeof Object.getOwnPropertySymbols === "function") {
            b = b.concat(Object.getOwnPropertySymbols(c).filter(function(a) {
                return Object.getOwnPropertyDescriptor(c, a).enumerable;
            }));
        }
        b.forEach(function(a) {
            l(d, a, c[a]);
        });
    }
    return d;
}
function p(b, a) {
    if (a && (r(a) === "object" || typeof a === "function")) {
        return a;
    }
    return h(b);
}
function q(a, b) {
    q = Object.setPrototypeOf || function c(a, b) {
        a.__proto__ = b;
        return a;
    };
    return q(a, b);
}
var r = function(a) {
    return a && typeof Symbol !== "undefined" && a.constructor === Symbol ? "symbol" : typeof a;
};
var b = (function(b) {
    "use strict";
    n(a, b);
    function a() {
        i(this, a);
        var b;
        b = p(this, m(a).apply(this, arguments));
        b.storeHighlightedItemReference = function(a) {
            b.props.onHighlightedItemChange(a === null ? null : a.item);
        };
        return b;
    }
    k(a, [
        {
            key: "shouldComponentUpdate",
            value: function b(a) {
                return g(a, this.props, [
                    "itemProps"
                ]);
            }
        },
        {
            key: "render",
            value: function j() {
                var k = this;
                var a = this.props, e = a.items, g = a.itemProps, l = a.renderItem, m = a.renderItemData, b = a.sectionIndex, n = a.highlightedItemIndex, p = a.getItemId, h = a.theme, c = a.keyPrefix;
                var i = b === null ? c : "".concat(c, "section-").concat(b, "-");
                var q = typeof g === "function";
                return d("ul", o({
                    role: "listbox"
                }, h("".concat(i, "items-list"), "itemsList"), {
                    children: e.map(function(j, a) {
                        var r = a === 0;
                        var c = a === n;
                        var s = "".concat(i, "item-").concat(a);
                        var t = q ? g({
                            sectionIndex: b,
                            itemIndex: a
                        }) : g;
                        var e = o({
                            id: p(b, a),
                            "aria-selected": c
                        }, h(s, "item", r && "itemFirst", c && "itemHighlighted"), t);
                        if (c) {
                            e.ref = k.storeHighlightedItemReference;
                        }
                        return d(f, o({}, e, {
                            sectionIndex: b,
                            isHighlighted: c,
                            itemIndex: a,
                            item: j,
                            renderItem: l,
                            renderItemData: m
                        }));
                    })
                }));
            }
        }, 
    ]);
    return a;
})(c);
b.propTypes = {
    items: a.array.isRequired,
    itemProps: a.oneOfType([
        a.object,
        a.func
    ]),
    renderItem: a.func.isRequired,
    renderItemData: a.object.isRequired,
    sectionIndex: a.number,
    highlightedItemIndex: a.number,
    onHighlightedItemChange: a.func.isRequired,
    getItemId: a.func.isRequired,
    theme: a.func.isRequired,
    keyPrefix: a.string.isRequired
};
b.defaultProps = {
    sectionIndex: null
};
export { b as default };
