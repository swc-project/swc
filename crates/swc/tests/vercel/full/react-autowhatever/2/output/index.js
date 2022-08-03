"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: function() {
        return l;
    }
});
var e = require("@swc/helpers/lib/_class_call_check.js").default, t = require("@swc/helpers/lib/_inherits.js").default, n = require("@swc/helpers/lib/_interop_require_wildcard.js").default, r = require("@swc/helpers/lib/_object_spread.js").default, i = require("@swc/helpers/lib/_object_spread_props.js").default, o = require("@swc/helpers/lib/_create_super.js").default, d = require("react/jsx-runtime"), a = n(require("react")), l = function(n) {
    "use strict";
    t(l, n);
    var a = o(l);
    function l() {
        var t;
        return e(this, l), t = a.apply(this, arguments), t.storeHighlightedItemReference = function(e) {
            t.props.onHighlightedItemChange(null === e ? null : e.item);
        }, t;
    }
    var u = l.prototype;
    return u.shouldComponentUpdate = function(e) {
        return compareObjects(e, this.props, [
            "itemProps"
        ]);
    }, u.render = function() {
        var e = this, t = this.props, n = t.items, o = t.itemProps, a = t.renderItem, l = t.renderItemData, u = t.sectionIndex, c = t.highlightedItemIndex, s = t.getItemId, p = t.theme, f = t.keyPrefix, m = null === u ? f : "".concat(f, "section-").concat(u, "-"), h = "function" == typeof o;
        return (0, d.jsx)("ul", i(r({
            role: "listbox"
        }, p("".concat(m, "items-list"), "itemsList")), {
            children: n.map(function(t, n) {
                var f = n === c, I = "".concat(m, "item-").concat(n), g = h ? o({
                    sectionIndex: u,
                    itemIndex: n
                }) : o, x = r({
                    id: s(u, n),
                    "aria-selected": f
                }, p(I, "item", 0 === n && "itemFirst", f && "itemHighlighted"), g);
                return f && (x.ref = e.storeHighlightedItemReference), (0, d.jsx)(Item, i(r({}, x), {
                    sectionIndex: u,
                    isHighlighted: f,
                    itemIndex: n,
                    item: t,
                    renderItem: a,
                    renderItemData: l
                }));
            })
        }));
    }, l;
}(a.Component);
l.propTypes = {
    items: 500
}, l.defaultProps = {
    sectionIndex: null
}, new l();
