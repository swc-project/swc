"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports["default"] = void 0;
var e = u(require("react"));
var t = o(require("prop-types"));
var r = o(require("./Item"));
var n = o(require("./compareObjects"));
function o(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}
function i() {
    if (typeof WeakMap !== "function") return null;
    var e = new WeakMap();
    i = function t() {
        return e;
    };
    return e;
}
function u(e) {
    if (e && e.__esModule) {
        return e;
    }
    if (e === null || (f(e) !== "object" && typeof e !== "function")) {
        return {
            default: e
        };
    }
    var t = i();
    if (t && t.has(e)) {
        return t.get(e);
    }
    var r = {};
    var n = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var o in e){
        if (Object.prototype.hasOwnProperty.call(e, o)) {
            var u = n ? Object.getOwnPropertyDescriptor(e, o) : null;
            if (u && (u.get || u.set)) {
                Object.defineProperty(r, o, u);
            } else {
                r[o] = e[o];
            }
        }
    }
    r["default"] = e;
    if (t) {
        t.set(e, r);
    }
    return r;
}
function f(e) {
    "@babel/helpers - typeof";
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        f = function e(t) {
            return typeof t;
        };
    } else {
        f = function e(t) {
            return t && typeof Symbol === "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
        };
    }
    return f(e);
}
function c() {
    c = Object.assign || function(e) {
        for(var t = 1; t < arguments.length; t++){
            var r = arguments[t];
            for(var n in r){
                if (Object.prototype.hasOwnProperty.call(r, n)) {
                    e[n] = r[n];
                }
            }
        }
        return e;
    };
    return c.apply(this, arguments);
}
function a(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        if (t) n = n.filter(function(t) {
            return Object.getOwnPropertyDescriptor(e, t).enumerable;
        });
        r.push.apply(r, n);
    }
    return r;
}
function l(e) {
    for(var t = 1; t < arguments.length; t++){
        var r = arguments[t] != null ? arguments[t] : {};
        if (t % 2) {
            a(Object(r), true).forEach(function(t) {
                w(e, t, r[t]);
            });
        } else if (Object.getOwnPropertyDescriptors) {
            Object.defineProperties(e, Object.getOwnPropertyDescriptors(r));
        } else {
            a(Object(r)).forEach(function(t) {
                Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
            });
        }
    }
    return e;
}
function p(e, t) {
    if (!(e instanceof t)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function s(e, t) {
    for(var r = 0; r < t.length; r++){
        var n = t[r];
        n.enumerable = n.enumerable || false;
        n.configurable = true;
        if ("value" in n) n.writable = true;
        Object.defineProperty(e, n.key, n);
    }
}
function y(e, t, r) {
    if (t) s(e.prototype, t);
    if (r) s(e, r);
    return e;
}
function d(e) {
    return function() {
        var t = m(e), r;
        if (g()) {
            var n = m(this).constructor;
            r = Reflect.construct(t, arguments, n);
        } else {
            r = t.apply(this, arguments);
        }
        return h(this, r);
    };
}
function h(e, t) {
    if (t && (f(t) === "object" || typeof t === "function")) {
        return t;
    }
    return v(e);
}
function v(e) {
    if (e === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return e;
}
function g() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
        Date.prototype.toString.call(Reflect.construct(Date, [], function() {}));
        return true;
    } catch (e) {
        return false;
    }
}
function m(e) {
    m = Object.setPrototypeOf ? Object.getPrototypeOf : function e(t) {
        return t.__proto__ || Object.getPrototypeOf(t);
    };
    return m(e);
}
function P(e, t) {
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
    if (t) I(e, t);
}
function I(e, t) {
    I = Object.setPrototypeOf || function e(t, r) {
        t.__proto__ = r;
        return t;
    };
    return I(e, t);
}
function w(e, t, r) {
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
var b = (function(t) {
    P(i, t);
    var o = d(i);
    function i() {
        var e;
        p(this, i);
        for(var t = arguments.length, r = new Array(t), n = 0; n < t; n++){
            r[n] = arguments[n];
        }
        e = o.call.apply(o, [
            this
        ].concat(r));
        w(v(e), "storeHighlightedItemReference", function(t) {
            e.props.onHighlightedItemChange(t === null ? null : t.item);
        });
        return e;
    }
    y(i, [
        {
            key: "shouldComponentUpdate",
            value: function e(t) {
                return (0, n["default"])(t, this.props, [
                    "itemProps", 
                ]);
            }
        },
        {
            key: "render",
            value: function t() {
                var n = this;
                var o = this.props, i = o.items, u = o.itemProps, f = o.renderItem, a = o.renderItemData, p = o.sectionIndex, s = o.highlightedItemIndex, y = o.getItemId, d = o.theme, h = o.keyPrefix;
                var v = p === null ? h : "".concat(h, "section-").concat(p, "-");
                var g = typeof u === "function";
                return e["default"].createElement("ul", c({
                    role: "listbox"
                }, d("".concat(v, "items-list"), "itemsList")), i.map(function(t, o) {
                    var i = o === 0;
                    var h = o === s;
                    var m = "".concat(v, "item-").concat(o);
                    var P = g ? u({
                        sectionIndex: p,
                        itemIndex: o
                    }) : u;
                    var I = l({
                        id: y(p, o),
                        "aria-selected": h
                    }, d(m, "item", i && "itemFirst", h && "itemHighlighted"), {}, P);
                    if (h) {
                        I.ref = n.storeHighlightedItemReference;
                    }
                    return e["default"].createElement(r["default"], c({}, I, {
                        sectionIndex: p,
                        isHighlighted: h,
                        itemIndex: o,
                        item: t,
                        renderItem: f,
                        renderItemData: a
                    }));
                }));
            }
        }, 
    ]);
    return i;
})(e.Component);
exports["default"] = b;
w(b, "propTypes", {
    items: t["default"].array.isRequired,
    itemProps: t["default"].oneOfType([
        t["default"].object,
        t["default"].func, 
    ]),
    renderItem: t["default"].func.isRequired,
    renderItemData: t["default"].object.isRequired,
    sectionIndex: t["default"].number,
    highlightedItemIndex: t["default"].number,
    onHighlightedItemChange: t["default"].func.isRequired,
    getItemId: t["default"].func.isRequired,
    theme: t["default"].func.isRequired,
    keyPrefix: t["default"].string.isRequired
});
w(b, "defaultProps", {
    sectionIndex: null
});
