"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), exports.default = void 0;
var f = require("@swc/helpers/lib/_class_call_check.js").default, g = require("@swc/helpers/lib/_inherits.js").default, c = require("@swc/helpers/lib/_interop_require_default.js").default, d = require("@swc/helpers/lib/_interop_require_wildcard.js").default, h = require("@swc/helpers/lib/_object_spread.js").default, i = require("@swc/helpers/lib/_object_spread_props.js").default, j = require("@swc/helpers/lib/_create_super.js").default, k = require("react/jsx-runtime"), e = d(require("react")), a = c(require("prop-types")), b = function(c) {
    "use strict";
    g(b, c);
    var d = j(b);
    function b() {
        var a;
        return f(this, b), a = d.apply(this, arguments), a.storeHighlightedItemReference = function(b) {
            a.props.onHighlightedItemChange(null === b ? null : b.item);
        }, a;
    }
    var a = b.prototype;
    return a.shouldComponentUpdate = function(a) {
        return !0;
    }, a.render = function() {
        var j = this, a = this.props, d = a.items, e = a.itemProps, l = a.renderItem, m = a.renderItemData, b = a.sectionIndex, n = a.highlightedItemIndex, o = a.getItemId, f = a.theme, c = a.keyPrefix, g = null === b ? c : "".concat(c, "section-").concat(b, "-"), p = "function" == typeof e;
        return k.jsx("ul", i(h({
            role: "listbox"
        }, f("".concat(g, "items-list"), "itemsList")), {
            children: d.map(function(q, a) {
                var c = a === n, r = "".concat(g, "item-").concat(a), s = p ? e({
                    sectionIndex: b,
                    itemIndex: a
                }) : e, d = h({
                    id: o(b, a),
                    "aria-selected": c
                }, f(r, "item", 0 === a && "itemFirst", c && "itemHighlighted"), s);
                return c && (d.ref = j.storeHighlightedItemReference), k.jsx(Item, i(h({}, d), {
                    sectionIndex: b,
                    isHighlighted: c,
                    itemIndex: a,
                    item: q,
                    renderItem: l,
                    renderItemData: m
                }));
            })
        }));
    }, b;
}(e.Component);
b.propTypes = {
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
}, b.defaultProps = {
    sectionIndex: null
}, new b(), exports.default = b;
