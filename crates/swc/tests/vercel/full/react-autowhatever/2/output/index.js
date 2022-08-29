"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: function() {
        return o;
    }
});
var e = require("@swc/helpers/lib/_class_call_check.js").default, t = require("@swc/helpers/lib/_inherits.js").default, r = require("@swc/helpers/lib/_interop_require_wildcard.js").default, i = require("@swc/helpers/lib/_object_spread.js").default, n = require("@swc/helpers/lib/_object_spread_props.js").default, s = require("@swc/helpers/lib/_create_super.js").default, l = require("react/jsx-runtime"), c = r(require("react")), o = function(r) {
    "use strict";
    t(o, r);
    var c = s(o);
    function o() {
        var t;
        return e(this, o), t = c.apply(this, arguments), t.storeHighlightedItemReference = function(e) {
            t.props.onHighlightedItemChange(null === e ? null : e.item);
        }, t;
    }
    var a = o.prototype;
    return a.shouldComponentUpdate = function(e) {
        return compareObjects(e, this.props, [
            "itemProps"
        ]);
    }, a.render = function() {
        var e = this, t = this.props, r = t.items, s = t.itemProps, c = t.renderItem, o = t.renderItemData, a = t.sectionIndex, d = t.highlightedItemIndex, u = t.getItemId, p = t.theme, h = t.keyPrefix, m = null === a ? h : "".concat(h, "section-").concat(a, "-"), f = "function" == typeof s;
        return (0, l.jsx)("ul", n(i({
            role: "listbox"
        }, p("".concat(m, "items-list"), "itemsList")), {
            children: r.map(function(t, r) {
                var h = r === d, I = "".concat(m, "item-").concat(r), g = f ? s({
                    sectionIndex: a,
                    itemIndex: r
                }) : s, x = i({
                    id: u(a, r),
                    "aria-selected": h
                }, p(I, "item", 0 === r && "itemFirst", h && "itemHighlighted"), g);
                return h && (x.ref = e.storeHighlightedItemReference), (0, l.jsx)(Item, n(i({}, x), {
                    sectionIndex: a,
                    isHighlighted: h,
                    itemIndex: r,
                    item: t,
                    renderItem: c,
                    renderItemData: o
                }));
            })
        }));
    }, o;
}(c.Component);
o.propTypes = {
    items: 500
}, o.defaultProps = {
    sectionIndex: null
}, new o();
