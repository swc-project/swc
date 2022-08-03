"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: function() {
        return o;
    }
});
var e = require("@swc/helpers/lib/_class_call_check.js").default, t = require("@swc/helpers/lib/_inherits.js").default, n = require("@swc/helpers/lib/_interop_require_default.js").default, r = require("@swc/helpers/lib/_interop_require_wildcard.js").default, i = require("@swc/helpers/lib/_object_spread.js").default, d = require("@swc/helpers/lib/_object_spread_props.js").default, u = require("@swc/helpers/lib/_create_super.js").default, a = require("react/jsx-runtime"), l = r(require("react")), f = n(require("prop-types")), o = function(n) {
    "use strict";
    t(o, n);
    var r = u(o);
    function o() {
        var t;
        return e(this, o), t = r.apply(this, arguments), t.storeHighlightedItemReference = function(e) {
            t.props.onHighlightedItemChange(null === e ? null : e.item);
        }, t;
    }
    var l = o.prototype;
    return l.shouldComponentUpdate = function(e) {
        return !0;
    }, l.render = function() {
        var e = this, t = this.props, n = t.items, r = t.itemProps, u = t.renderItem, l = t.renderItemData, f = t.sectionIndex, o = t.highlightedItemIndex, c = t.getItemId, s = t.theme, m = t.keyPrefix, h = null === f ? m : "".concat(m, "section-").concat(f, "-"), I = "function" == typeof r;
        return (0, a.jsx)("ul", d(i({
            role: "listbox"
        }, s("".concat(h, "items-list"), "itemsList")), {
            children: n.map(function(t, n) {
                var m = n === o, p = "".concat(h, "item-").concat(n), g = I ? r({
                    sectionIndex: f,
                    itemIndex: n
                }) : r, x = i({
                    id: c(f, n),
                    "aria-selected": m
                }, s(p, "item", 0 === n && "itemFirst", m && "itemHighlighted"), g);
                return m && (x.ref = e.storeHighlightedItemReference), (0, a.jsx)(Item, d(i({}, x), {
                    sectionIndex: f,
                    isHighlighted: m,
                    itemIndex: n,
                    item: t,
                    renderItem: u,
                    renderItemData: l
                }));
            })
        }));
    }, o;
}(l.Component);
o.propTypes = {
    items: f.default.array.isRequired,
    itemProps: f.default.oneOfType([
        f.default.object,
        f.default.func
    ]),
    renderItem: f.default.func.isRequired,
    renderItemData: f.default.object.isRequired,
    sectionIndex: f.default.number,
    highlightedItemIndex: f.default.number,
    onHighlightedItemChange: f.default.func.isRequired,
    getItemId: f.default.func.isRequired,
    theme: f.default.func.isRequired,
    keyPrefix: f.default.string.isRequired
}, o.defaultProps = {
    sectionIndex: null
}, new o();
