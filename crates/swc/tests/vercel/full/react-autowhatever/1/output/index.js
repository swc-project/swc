"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: function() {
        return _;
    }
});
var e = require("@swc/helpers/_/_call_super"), t = require("@swc/helpers/_/_class_call_check"), r = require("@swc/helpers/_/_create_class"), i = require("@swc/helpers/_/_define_property"), n = require("@swc/helpers/_/_inherits"), s = require("@swc/helpers/_/_interop_require_default"), u = require("@swc/helpers/_/_interop_require_wildcard"), d = require("@swc/helpers/_/_object_spread"), c = require("@swc/helpers/_/_object_spread_props"), l = require("react/jsx-runtime"), a = /*#__PURE__*/ u._(require("react")), o = /*#__PURE__*/ s._(require("prop-types")), _ = /*#__PURE__*/ function(s) {
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
                var e = this, t = this.props, r = t.items, i = t.itemProps, n = t.renderItem, s = t.renderItemData, u = t.sectionIndex, a = t.highlightedItemIndex, o = t.getItemId, _ = t.theme, p = t.keyPrefix, h = null === u ? p : "".concat(p, "section-").concat(u, "-"), f = "function" == typeof i;
                return /*#__PURE__*/ (0, l.jsx)("ul", c._(d._({
                    role: "listbox"
                }, _("".concat(h, "items-list"), "itemsList")), {
                    children: r.map(function(t, r) {
                        var p = 0 === r, m = r === a, I = "".concat(h, "item-").concat(r), g = f ? i({
                            sectionIndex: u,
                            itemIndex: r
                        }) : i, q = d._({
                            id: o(u, r),
                            "aria-selected": m
                        }, _(I, "item", p && "itemFirst", m && "itemHighlighted"), g);
                        return m && (q.ref = e.storeHighlightedItemReference), /*#__PURE__*/ (0, l.jsx)(Item, c._(d._({}, q), {
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
}(a.Component);
i._(_, "propTypes", {
    items: o.default.array.isRequired,
    itemProps: o.default.oneOfType([
        o.default.object,
        o.default.func
    ]),
    renderItem: o.default.func.isRequired,
    renderItemData: o.default.object.isRequired,
    sectionIndex: o.default.number,
    highlightedItemIndex: o.default.number,
    onHighlightedItemChange: o.default.func.isRequired,
    getItemId: o.default.func.isRequired,
    theme: o.default.func.isRequired,
    keyPrefix: o.default.string.isRequired
}), i._(_, "defaultProps", {
    sectionIndex: null
}), new _();
