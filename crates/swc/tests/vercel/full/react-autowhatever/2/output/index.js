"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), !function(a, b) {
    for(var c in b)Object.defineProperty(a, c, {
        get: b[c],
        enumerable: !0
    });
}(exports, {
    default: function() {
        return i;
    }
});
var a = require("@swc/helpers/lib/_class_call_check.js"), b = require("@swc/helpers/lib/_inherits.js"), c = require("@swc/helpers/lib/_interop_require_wildcard.js"), d = require("@swc/helpers/lib/_object_spread.js"), e = require("@swc/helpers/lib/_object_spread_props.js"), f = require("@swc/helpers/lib/_create_super.js"), g = require("react/jsx-runtime"), h = (0, c.default)(require("react")), i = function(c) {
    "use strict";
    (0, b.default)(i, c);
    var h = (0, f.default)(i);
    function i() {
        var b;
        return (0, a.default)(this, i), b = h.apply(this, arguments), b.storeHighlightedItemReference = function(a) {
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
        return (0, g.jsx)("ul", (0, e.default)((0, d.default)({
            role: "listbox"
        }, m("".concat(o, "items-list"), "itemsList")), {
            children: c.map(function(b, c) {
                var n = c === k, q = "".concat(o, "item-").concat(c), r = p ? f({
                    sectionIndex: j,
                    itemIndex: c
                }) : f, s = (0, d.default)({
                    id: l(j, c),
                    "aria-selected": n
                }, m(q, "item", 0 === c && "itemFirst", n && "itemHighlighted"), r);
                return n && (s.ref = a.storeHighlightedItemReference), (0, g.jsx)(Item, (0, e.default)((0, d.default)({}, s), {
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
}, new i();
