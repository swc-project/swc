"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: function() {
        return o;
    }
});
var e = require("@swc/helpers/lib/_class_call_check.js").default, t = require("@swc/helpers/lib/_inherits.js").default, r = require("@swc/helpers/lib/_interop_require_wildcard.js").default, i = require("@swc/helpers/lib/_object_spread.js").default, s = require("@swc/helpers/lib/_object_spread_props.js").default, n = require("@swc/helpers/lib/_create_super.js").default, l = require("react/jsx-runtime"), o = function(r) {
    "use strict";
    t(c, r);
    var o = n(c);
    function c() {
        var t;
        return e(this, c), t = o.apply(this, arguments), t.storeHighlightedItemReference = function(e) {
            t.props.onHighlightedItemChange(null === e ? null : e.item);
        }, t;
    }
    var u = c.prototype;
    return u.shouldComponentUpdate = function(e) {
        return compareObjects(e, this.props, [
            "itemProps"
        ]);
    }, u.render = function() {
        var e = this, t = this.props, r = t.items, n = t.itemProps, o = t.renderItem, c = t.renderItemData, u = t.sectionIndex, a = t.highlightedItemIndex, d = t.getItemId, p = t.theme, m = t.keyPrefix, h = null === u ? m : "".concat(m, "section-").concat(u, "-"), f = "function" == typeof n;
        return (0, l.jsx)("ul", s(i({
            role: "listbox"
        }, p("".concat(h, "items-list"), "itemsList")), {
            children: r.map(function(t, r) {
                var m = r === a, I = "".concat(h, "item-").concat(r), _ = f ? n({
                    sectionIndex: u,
                    itemIndex: r
                }) : n, g = i({
                    id: d(u, r),
                    "aria-selected": m
                }, p(I, "item", 0 === r && "itemFirst", m && "itemHighlighted"), _);
                return m && (g.ref = e.storeHighlightedItemReference), (0, l.jsx)(Item, s(i({}, g), {
                    sectionIndex: u,
                    isHighlighted: m,
                    itemIndex: r,
                    item: t,
                    renderItem: o,
                    renderItemData: c
                }));
            })
        }));
    }, c;
}(r(require("react")).Component);
o.propTypes = {
    items: 500
}, o.defaultProps = {
    sectionIndex: null
}, new o();
