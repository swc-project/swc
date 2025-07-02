"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: function() {
        return o;
    }
});
var e = require("@swc/helpers/_/_call_super"), t = require("@swc/helpers/_/_class_call_check"), r = require("@swc/helpers/_/_create_class"), i = require("@swc/helpers/_/_define_property"), n = require("@swc/helpers/_/_inherits"), s = require("@swc/helpers/_/_interop_require_default"), u = require("@swc/helpers/_/_object_spread"), d = require("@swc/helpers/_/_object_spread_props"), c = require("react/jsx-runtime"), l = require("react"), a = /*#__PURE__*/ s._(require("prop-types")), o = /*#__PURE__*/ function(s) {
    "use strict";
    function l() {
        var r;
        return t._(this, l), r = e._(this, l, arguments), i._(r, "storeHighlightedItemReference", function(e) {
            r.props.onHighlightedItemChange(null === e ? null : e.item);
        }), r;
    }
    return n._(l, s), r._(l, [
        {
            key: "shouldComponentUpdate",
            value: function(e) {
                return !0;
            }
        },
        {
            key: "render",
            value: function() {
                var e = this, t = this.props, r = t.items, i = t.itemProps, n = t.renderItem, s = t.renderItemData, l = t.sectionIndex, a = t.highlightedItemIndex, o = t.getItemId, _ = t.theme, p = t.keyPrefix, f = null === l ? p : "".concat(p, "section-").concat(l, "-"), h = "function" == typeof i;
                return (0, c.jsx)("ul", d._(u._({
                    role: "listbox"
                }, _("".concat(f, "items-list"), "itemsList")), {
                    children: r.map(function(t, r) {
                        var p = 0 === r, m = r === a, I = "".concat(f, "item-").concat(r), g = h ? i({
                            sectionIndex: l,
                            itemIndex: r
                        }) : i, q = u._({
                            id: o(l, r),
                            "aria-selected": m
                        }, _(I, "item", p && "itemFirst", m && "itemHighlighted"), g);
                        return m && (q.ref = e.storeHighlightedItemReference), (0, c.jsx)(Item, d._(u._({}, q), {
                            sectionIndex: l,
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
    ]), l;
}(l.Component);
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
