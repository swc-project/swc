"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: function() {
        return o;
    }
});
var e = require("@swc/helpers/_/_call_super"), t = require("@swc/helpers/_/_class_call_check"), r = require("@swc/helpers/_/_create_class"), i = require("@swc/helpers/_/_define_property"), n = require("@swc/helpers/_/_inherits"), s = require("@swc/helpers/_/_interop_require_default"), _ = require("@swc/helpers/_/_interop_require_wildcard"), u = require("@swc/helpers/_/_object_spread"), d = require("@swc/helpers/_/_object_spread_props"), c = require("react/jsx-runtime"), l = /*#__PURE__*/ _._(require("react")), a = /*#__PURE__*/ s._(require("prop-types")), o = /*#__PURE__*/ function(s) {
    "use strict";
    function _() {
        var r;
        return t._(this, _), r = e._(this, _, arguments), i._(r, "storeHighlightedItemReference", function(e) {
            r.props.onHighlightedItemChange(null === e ? null : e.item);
        }), r;
    }
    return n._(_, s), r._(_, [
        {
            key: "shouldComponentUpdate",
            value: function(e) {
                return !0;
            }
        },
        {
            key: "render",
            value: function() {
                var e = this, t = this.props, r = t.items, i = t.itemProps, n = t.renderItem, s = t.renderItemData, _ = t.sectionIndex, l = t.highlightedItemIndex, a = t.getItemId, o = t.theme, p = t.keyPrefix, h = null === _ ? p : "".concat(p, "section-").concat(_, "-"), f = "function" == typeof i;
                return (0, /*#__PURE__*/ /*#__PURE__*/ c.jsx)("ul", d._(u._({
                    role: "listbox"
                }, o("".concat(h, "items-list"), "itemsList")), {
                    children: r.map(function(t, r) {
                        var p = 0 === r, m = r === l, I = "".concat(h, "item-").concat(r), g = f ? i({
                            sectionIndex: _,
                            itemIndex: r
                        }) : i, q = u._({
                            id: a(_, r),
                            "aria-selected": m
                        }, o(I, "item", p && "itemFirst", m && "itemHighlighted"), g);
                        return m && (q.ref = e.storeHighlightedItemReference), (0, /*#__PURE__*/ /*#__PURE__*/ c.jsx)(Item, d._(u._({}, q), {
                            sectionIndex: _,
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
    ]), _;
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
