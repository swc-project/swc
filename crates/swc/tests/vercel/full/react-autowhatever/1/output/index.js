"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    get: function() {
        return k;
    },
    enumerable: !0
});
var a = require("@swc/helpers/lib/_class_call_check.js").default, b = require("@swc/helpers/lib/_inherits.js").default, c = require("@swc/helpers/lib/_interop_require_default.js").default, d = require("@swc/helpers/lib/_interop_require_wildcard.js").default, e = require("@swc/helpers/lib/_object_spread.js").default, f = require("@swc/helpers/lib/_object_spread_props.js").default, g = require("@swc/helpers/lib/_create_super.js").default, h = require("react/jsx-runtime"), i = d(require("react")), j = c(require("prop-types")), k = function(c) {
    "use strict";
    b(k, c);
    var d = g(k);
    function k() {
        var b;
        return a(this, k), b = d.apply(this, arguments), b.storeHighlightedItemReference = function(a) {
            b.props.onHighlightedItemChange(null === a ? null : a.item);
        }, b;
    }
    var i = k.prototype;
    return i.shouldComponentUpdate = function(a) {
        return !0;
    }, i.render = function() {
        var a = this, b = this.props, c = b.items, d = b.itemProps, g = b.renderItem, i = b.renderItemData, j = b.sectionIndex, k = b.highlightedItemIndex, l = b.getItemId, m = b.theme, n = b.keyPrefix, o = null === j ? n : "".concat(n, "section-").concat(j, "-"), p = "function" == typeof d;
        return (0, h.jsx)("ul", f(e({
            role: "listbox"
        }, m("".concat(o, "items-list"), "itemsList")), {
            children: c.map(function(b, c) {
                var n = c === k, q = "".concat(o, "item-").concat(c), r = p ? d({
                    sectionIndex: j,
                    itemIndex: c
                }) : d, s = e({
                    id: l(j, c),
                    "aria-selected": n
                }, m(q, "item", 0 === c && "itemFirst", n && "itemHighlighted"), r);
                return n && (s.ref = a.storeHighlightedItemReference), (0, h.jsx)(Item, f(e({}, s), {
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
