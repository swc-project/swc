"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports["default"] = void 0;
var d = i(require("react"));
var a = g(require("prop-types"));
var e = g(require("./Item"));
var f = g(require("./compareObjects"));
function g(a) {
    return a && a.__esModule ? a : {
        default: a
    };
}
function h() {
    if (typeof WeakMap !== "function") return null;
    var a = new WeakMap();
    h = function b() {
        return a;
    };
    return a;
}
function i(a) {
    if (a && a.__esModule) {
        return a;
    }
    if (a === null || (j(a) !== "object" && typeof a !== "function")) {
        return {
            default: a
        };
    }
    var b = h();
    if (b && b.has(a)) {
        return b.get(a);
    }
    var c = {};
    var f = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var d in a){
        if (Object.prototype.hasOwnProperty.call(a, d)) {
            var e = f ? Object.getOwnPropertyDescriptor(a, d) : null;
            if (e && (e.get || e.set)) {
                Object.defineProperty(c, d, e);
            } else {
                c[d] = a[d];
            }
        }
    }
    c["default"] = a;
    if (b) {
        b.set(a, c);
    }
    return c;
}
function j(a) {
    "@babel/helpers - typeof";
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        j = function b(a) {
            return typeof a;
        };
    } else {
        j = function b(a) {
            return a && typeof Symbol === "function" && a.constructor === Symbol && a !== Symbol.prototype ? "symbol" : typeof a;
        };
    }
    return j(a);
}
function k() {
    k = Object.assign || function(d) {
        for(var a = 1; a < arguments.length; a++){
            var b = arguments[a];
            for(var c in b){
                if (Object.prototype.hasOwnProperty.call(b, c)) {
                    d[c] = b[c];
                }
            }
        }
        return d;
    };
    return k.apply(this, arguments);
}
function l(c, d) {
    var a = Object.keys(c);
    if (Object.getOwnPropertySymbols) {
        var b = Object.getOwnPropertySymbols(c);
        if (d) b = b.filter(function(a) {
            return Object.getOwnPropertyDescriptor(c, a).enumerable;
        });
        a.push.apply(a, b);
    }
    return a;
}
function m(d) {
    for(var a = 1; a < arguments.length; a++){
        var b = arguments[a] != null ? arguments[a] : {};
        if (a % 2) {
            l(Object(b), true).forEach(function(a) {
                c(d, a, b[a]);
            });
        } else if (Object.getOwnPropertyDescriptors) {
            Object.defineProperties(d, Object.getOwnPropertyDescriptors(b));
        } else {
            l(Object(b)).forEach(function(a) {
                Object.defineProperty(d, a, Object.getOwnPropertyDescriptor(b, a));
            });
        }
    }
    return d;
}
function n(a, b) {
    if (!(a instanceof b)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function o(d, c) {
    for(var b = 0; b < c.length; b++){
        var a = c[b];
        a.enumerable = a.enumerable || false;
        a.configurable = true;
        if ("value" in a) a.writable = true;
        Object.defineProperty(d, a.key, a);
    }
}
function p(a, b, c) {
    if (b) o(a.prototype, b);
    if (c) o(a, c);
    return a;
}
function q(a) {
    return function() {
        var c = u(a), b;
        if (t()) {
            var d = u(this).constructor;
            b = Reflect.construct(c, arguments, d);
        } else {
            b = c.apply(this, arguments);
        }
        return r(this, b);
    };
}
function r(b, a) {
    if (a && (j(a) === "object" || typeof a === "function")) {
        return a;
    }
    return s(b);
}
function s(a) {
    if (a === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return a;
}
function t() {
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
function u(a) {
    u = Object.setPrototypeOf ? Object.getPrototypeOf : function b(a) {
        return a.__proto__ || Object.getPrototypeOf(a);
    };
    return u(a);
}
function v(b, a) {
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
    if (a) w(b, a);
}
function w(a, b) {
    w = Object.setPrototypeOf || function c(a, b) {
        a.__proto__ = b;
        return a;
    };
    return w(a, b);
}
function c(a, b, c) {
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
var b = (function(b) {
    v(a, b);
    var g = q(a);
    function a() {
        var d;
        n(this, a);
        for(var e = arguments.length, f = new Array(e), b = 0; b < e; b++){
            f[b] = arguments[b];
        }
        d = g.call.apply(g, [
            this
        ].concat(f));
        c(s(d), "storeHighlightedItemReference", function(a) {
            d.props.onHighlightedItemChange(a === null ? null : a.item);
        });
        return d;
    }
    p(a, [
        {
            key: "shouldComponentUpdate",
            value: function b(a) {
                return (0, f["default"])(a, this.props, [
                    "itemProps", 
                ]);
            }
        },
        {
            key: "render",
            value: function j() {
                var l = this;
                var a = this.props, f = a.items, g = a.itemProps, n = a.renderItem, o = a.renderItemData, b = a.sectionIndex, p = a.highlightedItemIndex, q = a.getItemId, h = a.theme, c = a.keyPrefix;
                var i = b === null ? c : "".concat(c, "section-").concat(b, "-");
                var r = typeof g === "function";
                return d["default"].createElement("ul", k({
                    role: "listbox"
                }, h("".concat(i, "items-list"), "itemsList")), f.map(function(j, a) {
                    var s = a === 0;
                    var c = a === p;
                    var t = "".concat(i, "item-").concat(a);
                    var u = r ? g({
                        sectionIndex: b,
                        itemIndex: a
                    }) : g;
                    var f = m({
                        id: q(b, a),
                        "aria-selected": c
                    }, h(t, "item", s && "itemFirst", c && "itemHighlighted"), {}, u);
                    if (c) {
                        f.ref = l.storeHighlightedItemReference;
                    }
                    return d["default"].createElement(e["default"], k({}, f, {
                        sectionIndex: b,
                        isHighlighted: c,
                        itemIndex: a,
                        item: j,
                        renderItem: n,
                        renderItemData: o
                    }));
                }));
            }
        }, 
    ]);
    return a;
})(d.Component);
exports["default"] = b;
c(b, "propTypes", {
    items: a["default"].array.isRequired,
    itemProps: a["default"].oneOfType([
        a["default"].object,
        a["default"].func, 
    ]),
    renderItem: a["default"].func.isRequired,
    renderItemData: a["default"].object.isRequired,
    sectionIndex: a["default"].number,
    highlightedItemIndex: a["default"].number,
    onHighlightedItemChange: a["default"].func.isRequired,
    getItemId: a["default"].func.isRequired,
    theme: a["default"].func.isRequired,
    keyPrefix: a["default"].string.isRequired
});
c(b, "defaultProps", {
    sectionIndex: null
});
