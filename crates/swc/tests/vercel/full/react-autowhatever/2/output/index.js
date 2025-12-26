"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: function() {
        return l;
    }
});
var e = require("@swc/helpers/_/_call_super"), r = require("@swc/helpers/_/_class_call_check"), t = require("@swc/helpers/_/_create_class"), i = require("@swc/helpers/_/_define_property"), n = require("@swc/helpers/_/_inherits"), s = require("@swc/helpers/_/_interop_require_wildcard"), c = require("@swc/helpers/_/_object_spread"), _ = require("@swc/helpers/_/_object_spread_props"), o = require("react/jsx-runtime"), l = /*#__PURE__*/ function(s) {
    "use strict";
    function l() {
        var t;
        return r._(this, l), t = e._(this, l, arguments), i._(t, "storeHighlightedItemReference", function(e) {
            t.props.onHighlightedItemChange(null === e ? null : e.item);
        }), t;
    }
    return n._(l, s), t._(l, [
        {
            key: "shouldComponentUpdate",
            value: function(e) {
                return compareObjects(e, this.props, [
                    "itemProps"
                ]);
            }
        },
        {
            key: "render",
            value: function() {
                var e = this, r = this.props, t = r.items, i = r.itemProps, n = r.renderItem, s = r.renderItemData, l = r.sectionIndex, u = r.highlightedItemIndex, a = r.getItemId, p = r.theme, d = r.keyPrefix, h = null === l ? d : "".concat(d, "section-").concat(l, "-"), m = "function" == typeof i;
                return (0, o.jsx)("ul", _._(c._({
                    role: "listbox"
                }, p("".concat(h, "items-list"), "itemsList")), {
                    children: t.map(function(r, t) {
                        var d = 0 === t, f = t === u, I = "".concat(h, "item-").concat(t), g = m ? i({
                            sectionIndex: l,
                            itemIndex: t
                        }) : i, x = c._({
                            id: a(l, t),
                            "aria-selected": f
                        }, p(I, "item", d && "itemFirst", f && "itemHighlighted"), g);
                        return f && (x.ref = e.storeHighlightedItemReference), (0, o.jsx)(Item, _._(c._({}, x), {
                            sectionIndex: l,
                            isHighlighted: f,
                            itemIndex: t,
                            item: r,
                            renderItem: n,
                            renderItemData: s
                        }));
                    })
                }));
            }
        }
    ]), l;
}(/*#__PURE__*/ s._(require("react")).Component);
new l();
