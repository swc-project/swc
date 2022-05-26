"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), exports.default = void 0;
var d = require("@swc/helpers/lib/_class_call_check.js").default, e = require("@swc/helpers/lib/_inherits.js").default, b = require("@swc/helpers/lib/_interop_require_wildcard.js").default, f = require("@swc/helpers/lib/_object_spread.js").default, g = require("@swc/helpers/lib/_object_spread_props.js").default, h = require("@swc/helpers/lib/_create_super.js").default, i = require("react/jsx-runtime"), c = b(require("react")), a = function(c) {
    "use strict";
    e(a, c);
    var j = h(a);
    function a() {
        var b;
        return d(this, a), b = j.apply(this, arguments), b.storeHighlightedItemReference = function(a) {
            b.props.onHighlightedItemChange(null === a ? null : a.item);
        }, b;
    }
    var b = a.prototype;
    return b.shouldComponentUpdate = function(a) {
        return compareObjects(a, this.props, [
            "itemProps"
        ]);
    }, b.render = function() {
        var k = this, a = this.props, d = a.items, e = a.itemProps, l = a.renderItem, m = a.renderItemData, b = a.sectionIndex, n = a.highlightedItemIndex, o = a.getItemId, h = a.theme, c = a.keyPrefix, j = null === b ? c : "".concat(c, "section-").concat(b, "-"), p = "function" == typeof e;
        return i.jsx("ul", g(f({
            role: "listbox"
        }, h("".concat(j, "items-list"), "itemsList")), {
            children: d.map(function(q, a) {
                var c = a === n, r = "".concat(j, "item-").concat(a), s = p ? e({
                    sectionIndex: b,
                    itemIndex: a
                }) : e, d = f({
                    id: o(b, a),
                    "aria-selected": c
                }, h(r, "item", 0 === a && "itemFirst", c && "itemHighlighted"), s);
                return c && (d.ref = k.storeHighlightedItemReference), i.jsx(Item, g(f({}, d), {
                    sectionIndex: b,
                    isHighlighted: c,
                    itemIndex: a,
                    item: q,
                    renderItem: l,
                    renderItemData: m
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
