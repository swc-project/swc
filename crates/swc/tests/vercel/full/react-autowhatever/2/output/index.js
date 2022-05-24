"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), exports.default = void 0;
var d = require("@swc/helpers/lib/_class_call_check.js").default, e = require("@swc/helpers/lib/_inherits.js").default, b = require("@swc/helpers/lib/_interop_require_wildcard.js").default, f = require("@swc/helpers/lib/_object_spread.js").default, g = require("@swc/helpers/lib/_create_super.js").default, h = require("react/jsx-runtime"), c = b(require("react")), a = function(c) {
    "use strict";
    e(a, c);
    var i = g(a);
    function a() {
        var b;
        return d(this, a), b = i.apply(this, arguments), b.storeHighlightedItemReference = function(a) {
            b.props.onHighlightedItemChange(null === a ? null : a.item);
        }, b;
    }
    var b = a.prototype;
    return b.shouldComponentUpdate = function(a) {
        return compareObjects(a, this.props, [
            "itemProps"
        ]);
    }, b.render = function() {
        var j = this, a = this.props, d = a.items, e = a.itemProps, k = a.renderItem, l = a.renderItemData, b = a.sectionIndex, m = a.highlightedItemIndex, n = a.getItemId, g = a.theme, c = a.keyPrefix, i = null === b ? c : "".concat(c, "section-").concat(b, "-"), o = "function" == typeof e;
        return h.jsx("ul", f({
            role: "listbox"
        }, g("".concat(i, "items-list"), "itemsList"), {
            children: d.map(function(p, a) {
                var c = a === m, q = "".concat(i, "item-").concat(a), r = o ? e({
                    sectionIndex: b,
                    itemIndex: a
                }) : e, d = f({
                    id: n(b, a),
                    "aria-selected": c
                }, g(q, "item", 0 === a && "itemFirst", c && "itemHighlighted"), r);
                return c && (d.ref = j.storeHighlightedItemReference), h.jsx(Item, f({}, d, {
                    sectionIndex: b,
                    isHighlighted: c,
                    itemIndex: a,
                    item: p,
                    renderItem: k,
                    renderItemData: l
                }));
            })
        }));
    }, a;
}(c.Component);
a.propTypes = {
    items: 500
}, a.defaultProps = {
    sectionIndex: null
}, new a(), exports.default = a;
