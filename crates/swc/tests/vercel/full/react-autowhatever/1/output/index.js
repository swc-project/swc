"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: function() {
        return p;
    }
});
var e = require("@swc/helpers/lib/_assert_this_initialized.js").default, t = require("@swc/helpers/lib/_class_call_check.js").default, r = require("@swc/helpers/lib/_create_class.js").default, i = require("@swc/helpers/lib/_define_property.js").default, s = require("@swc/helpers/lib/_extends.js").default, n = require("@swc/helpers/lib/_inherits.js").default, u = require("@swc/helpers/lib/_interop_require_default.js").default, l = require("@swc/helpers/lib/_interop_require_wildcard.js").default, d = require("@swc/helpers/lib/_object_spread_props.js").default, a = require("@swc/helpers/lib/_create_super.js").default, c = require("react/jsx-runtime"), o = l(require("react")), f = u(require("prop-types")), p = function(u) {
    "use strict";
    n(o, u);
    var l = a(o);
    function o() {
        var r;
        return t(this, o), r = l.apply(this, arguments), i(e(r), "storeHighlightedItemReference", function(e) {
            r.props.onHighlightedItemChange(null === e ? null : e.item);
        }), r;
    }
    return r(o, [
        {
            key: "shouldComponentUpdate",
            value: function(e) {
                return !0;
            }
        },
        {
            key: "render",
            value: function() {
                var e = this, t = this.props, r = t.items, i = t.itemProps, n = t.renderItem, u = t.renderItemData, l = t.sectionIndex, a = t.highlightedItemIndex, o = t.getItemId, f = t.theme, p = t.keyPrefix, h = null === l ? p : "".concat(p, "section-").concat(l, "-"), m = "function" == typeof i;
                return (0, c.jsx)("ul", d(s({
                    role: "listbox"
                }, f("".concat(h, "items-list"), "itemsList")), {
                    children: r.map(function(t, r) {
                        var p = r === a, I = "".concat(h, "item-").concat(r), _ = m ? i({
                            sectionIndex: l,
                            itemIndex: r
                        }) : i, g = s({
                            id: o(l, r),
                            "aria-selected": p
                        }, f(I, "item", 0 === r && "itemFirst", p && "itemHighlighted"), _);
                        return p && (g.ref = e.storeHighlightedItemReference), (0, c.jsx)(Item, d(s({}, g), {
                            sectionIndex: l,
                            isHighlighted: p,
                            itemIndex: r,
                            item: t,
                            renderItem: n,
                            renderItemData: u
                        }));
                    })
                }));
            }
        }
    ]), o;
}(o.Component);
i(p, "propTypes", {
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
}), i(p, "defaultProps", {
    sectionIndex: null
}), new p();
