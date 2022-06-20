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
        return k;
    }
});
var a = require("@swc/helpers/lib/_class_call_check.js"), b = require("@swc/helpers/lib/_inherits.js"), c = require("@swc/helpers/lib/_interop_require_default.js"), d = require("@swc/helpers/lib/_interop_require_wildcard.js"), e = require("@swc/helpers/lib/_object_spread.js"), f = require("@swc/helpers/lib/_object_spread_props.js"), g = require("@swc/helpers/lib/_create_super.js"), h = require("react/jsx-runtime"), i = (0, d.default)(require("react")), j = (0, c.default)(require("prop-types")), k = function(c) {
    "use strict";
    (0, b.default)(k, c);
    var d = (0, g.default)(k);
    function k() {
        var b;
        return (0, a.default)(this, k), b = d.apply(this, arguments), b.storeHighlightedItemReference = function(a) {
            b.props.onHighlightedItemChange(null === a ? null : a.item);
        }, b;
    }
    var i = k.prototype;
    return i.shouldComponentUpdate = function(a) {
        return !0;
    }, i.render = function() {
        var a = this, b = this.props, c = b.items, d = b.itemProps, g = b.renderItem, i = b.renderItemData, j = b.sectionIndex, k = b.highlightedItemIndex, l = b.getItemId, m = b.theme, n = b.keyPrefix, o = null === j ? n : "".concat(n, "section-").concat(j, "-"), p = "function" == typeof d;
        return (0, h.jsx)("ul", (0, f.default)((0, e.default)({
            role: "listbox"
        }, m("".concat(o, "items-list"), "itemsList")), {
            children: c.map(function(b, c) {
                var n = c === k, q = "".concat(o, "item-").concat(c), r = p ? d({
                    sectionIndex: j,
                    itemIndex: c
                }) : d, s = (0, e.default)({
                    id: l(j, c),
                    "aria-selected": n
                }, m(q, "item", 0 === c && "itemFirst", n && "itemHighlighted"), r);
                return n && (s.ref = a.storeHighlightedItemReference), (0, h.jsx)(Item, (0, f.default)((0, e.default)({}, s), {
                    sectionIndex: j,
                    isHighlighted: n,
                    itemIndex: c,
                    item: b,
                    renderItem: g,
                    renderItemData: i
                }));
            })
        }));
    }, k;
}(i.Component);
k.propTypes = {
    items: j.default.array.isRequired,
    itemProps: j.default.oneOfType([
        j.default.object,
        j.default.func
    ]),
    renderItem: j.default.func.isRequired,
    renderItemData: j.default.object.isRequired,
    sectionIndex: j.default.number,
    highlightedItemIndex: j.default.number,
    onHighlightedItemChange: j.default.func.isRequired,
    getItemId: j.default.func.isRequired,
    theme: j.default.func.isRequired,
    keyPrefix: j.default.string.isRequired
}, k.defaultProps = {
    sectionIndex: null
}, new k();
