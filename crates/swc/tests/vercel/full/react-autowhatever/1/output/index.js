"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: function() {
        return o;
    }
});
var e = require("@swc/helpers/_/_call_super"), t = require("@swc/helpers/_/_class_call_check"), r = require("@swc/helpers/_/_create_class"), i = require("@swc/helpers/_/_define_property"), n = require("@swc/helpers/_/_inherits"), s = require("@swc/helpers/_/_interop_require_default"), u = require("@swc/helpers/_/_interop_require_wildcard"), d = require("@swc/helpers/_/_object_spread"), c = require("@swc/helpers/_/_object_spread_props"), l = require("react/jsx-runtime"), _ = /*#__PURE__*/ u._(require("react")), a = /*#__PURE__*/ s._(require("prop-types")), o = /*#__PURE__*/ function(s) {
    "use strict";
    function u() {
        var r;
        return t._(this, u), r = e._(this, u, arguments), i._(r, "storeHighlightedItemReference", function(e) {
            r.props.onHighlightedItemChange(null === e ? null : e.item);
        }), r;
    }
    return n._(u, s), r._(u, [
        {
            key: "shouldComponentUpdate",
            value: function(e) {
                return !0;
            }
        },
        {
            key: "render",
            value: function() {
                var e = this, t = this.props, r = t.items, i = t.itemProps, n = t.renderItem, s = t.renderItemData, u = t.sectionIndex, _ = t.highlightedItemIndex, a = t.getItemId, o = t.theme, p = t.keyPrefix, h = null === u ? p : "".concat(p, "section-").concat(u, "-"), f = "function" == typeof i;
                return (0, l.jsx)("ul", c._(d._({
                    role: "listbox"
                }, o("".concat(h, "items-list"), "itemsList")), {
                    children: r.map(function(t, r) {
                        var p = 0 === r, m = r === _, I = "".concat(h, "item-").concat(r), g = f ? i({
                            sectionIndex: u,
                            itemIndex: r
                        }) : i, q = d._({
                            id: a(u, r),
                            "aria-selected": m
                        }, o(I, "item", p && "itemFirst", m && "itemHighlighted"), g);
                        return m && (q.ref = e.storeHighlightedItemReference), (0, l.jsx)(Item, c._(d._({}, q), {
                            sectionIndex: u,
                            isHighlighted: m,
                            itemIndex: r,
                            item: t,
                            renderItem: n,
                            renderItemData: s
                        }));
                    })
                }));
            }
        }
    ]), u;
}(_.Component);
i._(o, "propTypes", {
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
}), i._(o, "defaultProps", {
    sectionIndex: null
}), new o();
