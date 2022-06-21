"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), exports.default = void 0;
var a = require("@swc/helpers/lib/_class_call_check.js").default, b = require("@swc/helpers/lib/_inherits.js").default, c = require("@swc/helpers/lib/_interop_require_wildcard.js").default, d = require("@swc/helpers/lib/_object_spread.js").default, e = require("@swc/helpers/lib/_object_spread_props.js").default, f = require("@swc/helpers/lib/_create_super.js").default, g = require("react/jsx-runtime"), h = c(require("react")), i = function(c) {
    "use strict";
    b(i, c);
    var h = f(i);
    function i() {
        var b;
        return a(this, i), b = h.apply(this, arguments), b.storeHighlightedItemReference = function(a) {
            b.props.onHighlightedItemChange(null === a ? null : a.item);
        }, b;
    }
    var j = i.prototype;
    return j.shouldComponentUpdate = function(a) {
        return compareObjects(a, this.props, [
            "itemProps"
        ]);
    }, j.render = function() {
        var a = this, b = this.props, c = b.items, f = b.itemProps, h = b.renderItem, i = b.renderItemData, j = b.sectionIndex, k = b.highlightedItemIndex, l = b.getItemId, m = b.theme, n = b.keyPrefix, o = null === j ? n : "".concat(n, "section-").concat(j, "-"), p = "function" == typeof f;
        return g.jsx("ul", e(d({
            role: "listbox"
        }, m("".concat(o, "items-list"), "itemsList")), {
            children: c.map(function(b, c) {
                var n = c === k, q = "".concat(o, "item-").concat(c), r = p ? f({
                    sectionIndex: j,
                    itemIndex: c
                }) : f, s = d({
                    id: l(j, c),
                    "aria-selected": n
                }, m(q, "item", 0 === c && "itemFirst", n && "itemHighlighted"), r);
                return n && (s.ref = a.storeHighlightedItemReference), g.jsx(Item, e(d({}, s), {
                    sectionIndex: j,
                    isHighlighted: n,
                    itemIndex: c,
                    item: b,
                    renderItem: h,
                    renderItemData: i
                }));
            })
        }));
    }, i;
}(h.Component);
i.propTypes = {
    items: 500
}, i.defaultProps = {
    sectionIndex: null
}, new i(), exports.default = i;
