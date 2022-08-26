"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: function() {
        return c;
    }
});
var e = require("@swc/helpers/lib/_class_call_check.js").default, t = require("@swc/helpers/lib/_inherits.js").default, r = require("@swc/helpers/lib/_interop_require_default.js").default, i = require("@swc/helpers/lib/_interop_require_wildcard.js").default, n = require("@swc/helpers/lib/_object_spread.js").default, s = require("@swc/helpers/lib/_object_spread_props.js").default, d = require("@swc/helpers/lib/_create_super.js").default, l = require("react/jsx-runtime"), u = i(require("react")), a = r(require("prop-types")), c = function(r) {
    "use strict";
    t(u, r);
    var i = d(u);
    function u() {
        var t;
        return e(this, u), t = i.apply(this, arguments), t.storeHighlightedItemReference = function(e) {
            t.props.onHighlightedItemChange(null === e ? null : e.item);
        }, t;
    }
    var a = u.prototype;
    return a.shouldComponentUpdate = function(e) {
        return !0;
    }, a.render = function() {
        var e = this, t = this.props, r = t.items, i = t.itemProps, d = t.renderItem, u = t.renderItemData, a = t.sectionIndex, c = t.highlightedItemIndex, o = t.getItemId, f = t.theme, p = t.keyPrefix, h = null === a ? p : "".concat(p, "section-").concat(a, "-"), m = "function" == typeof i;
        return (0, l.jsx)("ul", s(n({
            role: "listbox"
        }, f("".concat(h, "items-list"), "itemsList")), {
            children: r.map(function(t, r) {
                var p = r === c, I = "".concat(h, "item-").concat(r), g = m ? i({
                    sectionIndex: a,
                    itemIndex: r
                }) : i, b = n({
                    id: o(a, r),
                    "aria-selected": p
                }, f(I, "item", 0 === r && "itemFirst", p && "itemHighlighted"), g);
                return p && (b.ref = e.storeHighlightedItemReference), (0, l.jsx)(Item, s(n({}, b), {
                    sectionIndex: a,
                    isHighlighted: p,
                    itemIndex: r,
                    item: t,
                    renderItem: d,
                    renderItemData: u
                }));
            })
        }));
    }, u;
}(u.Component);
c.propTypes = {
    items: a.default.array.isRequired,
    itemProps: a.default.oneOfType([
        a.default.object,
        a.default.func
    ]),
    renderItem: a.default.func.isRequired,
    renderItemData: a.default.object.isRequired,
    sectionIndex: a.default.number,
    highlightedItemIndex: a.default.number,
    onHighlightedItemChange: a.default.func.isRequired,
    getItemId: a.default.func.isRequired,
    theme: a.default.func.isRequired,
    keyPrefix: a.default.string.isRequired
}, c.defaultProps = {
    sectionIndex: null
}, new c();
