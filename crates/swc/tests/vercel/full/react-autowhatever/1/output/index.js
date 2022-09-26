"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: function() {
        return a;
    }
});
var e = require("@swc/helpers/lib/_class_call_check.js").default, t = require("@swc/helpers/lib/_inherits.js").default, r = require("@swc/helpers/lib/_interop_require_default.js").default, i = require("@swc/helpers/lib/_interop_require_wildcard.js").default, n = require("@swc/helpers/lib/_object_spread.js").default, s = require("@swc/helpers/lib/_object_spread_props.js").default, u = require("@swc/helpers/lib/_create_super.js").default, d = require("react/jsx-runtime"), l = r(require("prop-types")), a = function(r) {
    "use strict";
    t(l, r);
    var i = u(l);
    function l() {
        var t;
        return e(this, l), t = i.apply(this, arguments), t.storeHighlightedItemReference = function(e) {
            t.props.onHighlightedItemChange(null === e ? null : e.item);
        }, t;
    }
    var a = l.prototype;
    return a.shouldComponentUpdate = function(e) {
        return !0;
    }, a.render = function() {
        var e = this, t = this.props, r = t.items, i = t.itemProps, u = t.renderItem, l = t.renderItemData, a = t.sectionIndex, c = t.highlightedItemIndex, o = t.getItemId, f = t.theme, p = t.keyPrefix, m = null === a ? p : "".concat(p, "section-").concat(a, "-"), h = "function" == typeof i;
        return (0, d.jsx)("ul", s(n({
            role: "listbox"
        }, f("".concat(m, "items-list"), "itemsList")), {
            children: r.map(function(t, r) {
                var p = r === c, I = "".concat(m, "item-").concat(r), g = h ? i({
                    sectionIndex: a,
                    itemIndex: r
                }) : i, q = n({
                    id: o(a, r),
                    "aria-selected": p
                }, f(I, "item", 0 === r && "itemFirst", p && "itemHighlighted"), g);
                return p && (q.ref = e.storeHighlightedItemReference), (0, d.jsx)(Item, s(n({}, q), {
                    sectionIndex: a,
                    isHighlighted: p,
                    itemIndex: r,
                    item: t,
                    renderItem: u,
                    renderItemData: l
                }));
            })
        }));
    }, l;
}(i(require("react")).Component);
a.propTypes = {
    items: l.default.array.isRequired,
    itemProps: l.default.oneOfType([
        l.default.object,
        l.default.func
    ]),
    renderItem: l.default.func.isRequired,
    renderItemData: l.default.object.isRequired,
    sectionIndex: l.default.number,
    highlightedItemIndex: l.default.number,
    onHighlightedItemChange: l.default.func.isRequired,
    getItemId: l.default.func.isRequired,
    theme: l.default.func.isRequired,
    keyPrefix: l.default.string.isRequired
}, a.defaultProps = {
    sectionIndex: null
}, new a();
