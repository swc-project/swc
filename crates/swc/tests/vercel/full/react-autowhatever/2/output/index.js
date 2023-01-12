"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: function() {
        return l;
    }
});
var e = require("@swc/helpers/lib/_class_call_check.js").default, t = require("@swc/helpers/lib/_inherits.js").default, r = require("@swc/helpers/lib/_interop_require_wildcard.js").default, i = require("@swc/helpers/lib/_object_spread.js").default, s = require("@swc/helpers/lib/_object_spread_props.js").default, n = require("@swc/helpers/lib/_create_super.js").default, c = require("react/jsx-runtime"), l = function(r) {
    "use strict";
    t(o, r);
    var l = n(o);
    function o() {
        var t;
        return e(this, o), t = l.apply(this, arguments), t.storeHighlightedItemReference = function(e) {
            t.props.onHighlightedItemChange(null === e ? null : e.item);
        }, t;
    }
    var u = o.prototype;
    return u.shouldComponentUpdate = function(e) {
        return compareObjects(e, this.props, [
            "itemProps"
        ]);
    }, u.render = function() {
        var e = this, t = this.props, r = t.items, n = t.itemProps, l = t.renderItem, o = t.renderItemData, u = t.sectionIndex, a = t.highlightedItemIndex, d = t.getItemId, p = t.theme, m = t.keyPrefix, h = null === u ? m : "".concat(m, "section-").concat(u, "-"), f = "function" == typeof n;
        return (0, c.jsx)("ul", s(i({
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
                return m && (g.ref = e.storeHighlightedItemReference), (0, c.jsx)(Item, s(i({}, g), {
                    sectionIndex: u,
                    isHighlighted: m,
                    itemIndex: r,
                    item: t,
                    renderItem: l,
                    renderItemData: o
                }));
            })
        }));
    }, o;
}(r(require("react")).Component);
l.propTypes = {
    items: 500
}, l.defaultProps = {
    sectionIndex: null
}, new l();
