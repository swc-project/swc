"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports["default"] = void 0;
var a = g(require("react"));
var b = e(require("prop-types"));
var c = e(require("./Item"));
var d = e(require("./compareObjects"));
function e(a) {
    return a && a.__esModule ? a : {
        default: a
    };
}
function f() {
    if (typeof WeakMap !== "function") return null;
    var a = new WeakMap();
    f = function b() {
        return a;
    };
    return a;
}
function g(a) {
    if (a && a.__esModule) {
        return a;
    }
    if (a === null || (h(a) !== "object" && typeof a !== "function")) {
        return {
            default: a
        };
    }
    var b = f();
    if (b && b.has(a)) {
        return b.get(a);
    }
    var c = {};
    var d = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var e in a){
        if (Object.prototype.hasOwnProperty.call(a, e)) {
            var g = d ? Object.getOwnPropertyDescriptor(a, e) : null;
            if (g && (g.get || g.set)) {
                Object.defineProperty(c, e, g);
            } else {
                c[e] = a[e];
            }
        }
    }
    c["default"] = a;
    if (b) {
        b.set(a, c);
    }
    return c;
}
function h(a) {
    "@babel/helpers - typeof";
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        h = function a(b) {
            return typeof b;
        };
    } else {
        h = function a(b) {
            return b && typeof Symbol === "function" && b.constructor === Symbol && b !== Symbol.prototype ? "symbol" : typeof b;
        };
    }
    return h(a);
}
function i() {
    i = Object.assign || function(a) {
        for(var b = 1; b < arguments.length; b++){
            var c = arguments[b];
            for(var d in c){
                if (Object.prototype.hasOwnProperty.call(c, d)) {
                    a[d] = c[d];
                }
            }
        }
        return a;
    };
    return i.apply(this, arguments);
}
function j(a, b) {
    var c = Object.keys(a);
    if (Object.getOwnPropertySymbols) {
        var d = Object.getOwnPropertySymbols(a);
        if (b) d = d.filter(function(b) {
            return Object.getOwnPropertyDescriptor(a, b).enumerable;
        });
        c.push.apply(c, d);
    }
    return c;
}
function k(a) {
    for(var b = 1; b < arguments.length; b++){
        var c = arguments[b] != null ? arguments[b] : {};
        if (b % 2) {
            j(Object(c), true).forEach(function(b) {
                v(a, b, c[b]);
            });
        } else if (Object.getOwnPropertyDescriptors) {
            Object.defineProperties(a, Object.getOwnPropertyDescriptors(c));
        } else {
            j(Object(c)).forEach(function(b) {
                Object.defineProperty(a, b, Object.getOwnPropertyDescriptor(c, b));
            });
        }
    }
    return a;
}
function l(a, b) {
    if (!(a instanceof b)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function m(a, b) {
    for(var c = 0; c < b.length; c++){
        var d = b[c];
        d.enumerable = d.enumerable || false;
        d.configurable = true;
        if ("value" in d) d.writable = true;
        Object.defineProperty(a, d.key, d);
    }
}
function n(a, b, c) {
    if (b) m(a.prototype, b);
    if (c) m(a, c);
    return a;
}
function o(a) {
    return function() {
        var b = s(a), c;
        if (r()) {
            var d = s(this).constructor;
            c = Reflect.construct(b, arguments, d);
        } else {
            c = b.apply(this, arguments);
        }
        return p(this, c);
    };
}
function p(a, b) {
    if (b && (h(b) === "object" || typeof b === "function")) {
        return b;
    }
    return q(a);
}
function q(a) {
    if (a === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return a;
}
function r() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
        Date.prototype.toString.call(Reflect.construct(Date, [], function() {}));
        return true;
    } catch (a) {
        return false;
    }
}
function s(a) {
    s = Object.setPrototypeOf ? Object.getPrototypeOf : function a(b) {
        return b.__proto__ || Object.getPrototypeOf(b);
    };
    return s(a);
}
function t(a, b) {
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
    if (b) u(a, b);
}
function u(a, b) {
    u = Object.setPrototypeOf || function a(b, c) {
        b.__proto__ = c;
        return b;
    };
    return u(a, b);
}
function v(a, b, c) {
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
var w = (function(b) {
    t(f, b);
    var e = o(f);
    function f() {
        var a;
        l(this, f);
        for(var b = arguments.length, c = new Array(b), d = 0; d < b; d++){
            c[d] = arguments[d];
        }
        a = e.call.apply(e, [
            this
        ].concat(c));
        v(q(a), "storeHighlightedItemReference", function(b) {
            a.props.onHighlightedItemChange(b === null ? null : b.item);
        });
        return a;
    }
    n(f, [
        {
            key: "shouldComponentUpdate",
            value: function a(b) {
                return (0, d["default"])(b, this.props, [
                    "itemProps", 
                ]);
            }
        },
        {
            key: "render",
            value: function b() {
                var d = this;
                var e = this.props, f = e.items, g = e.itemProps, h = e.renderItem, j = e.renderItemData, l = e.sectionIndex, m = e.highlightedItemIndex, n = e.getItemId, o = e.theme, p = e.keyPrefix;
                var q = l === null ? p : "".concat(p, "section-").concat(l, "-");
                var r = typeof g === "function";
                return a["default"].createElement("ul", i({
                    role: "listbox"
                }, o("".concat(q, "items-list"), "itemsList")), f.map(function(b, e) {
                    var f = e === 0;
                    var p = e === m;
                    var s = "".concat(q, "item-").concat(e);
                    var t = r ? g({
                        sectionIndex: l,
                        itemIndex: e
                    }) : g;
                    var u = k({
                        id: n(l, e),
                        "aria-selected": p
                    }, o(s, "item", f && "itemFirst", p && "itemHighlighted"), {}, t);
                    if (p) {
                        u.ref = d.storeHighlightedItemReference;
                    }
                    return a["default"].createElement(c["default"], i({}, u, {
                        sectionIndex: l,
                        isHighlighted: p,
                        itemIndex: e,
                        item: b,
                        renderItem: h,
                        renderItemData: j
                    }));
                }));
            }
        }, 
    ]);
    return f;
})(a.Component);
exports["default"] = w;
v(w, "propTypes", {
    items: b["default"].array.isRequired,
    itemProps: b["default"].oneOfType([
        b["default"].object,
        b["default"].func, 
    ]),
    renderItem: b["default"].func.isRequired,
    renderItemData: b["default"].object.isRequired,
    sectionIndex: b["default"].number,
    highlightedItemIndex: b["default"].number,
    onHighlightedItemChange: b["default"].func.isRequired,
    getItemId: b["default"].func.isRequired,
    theme: b["default"].func.isRequired,
    keyPrefix: b["default"].string.isRequired
});
v(w, "defaultProps", {
    sectionIndex: null
});
