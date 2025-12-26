"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: function() {
        return l;
    }
});
var e = require("@swc/helpers/_/_call_super"), t = require("@swc/helpers/_/_class_call_check"), r = require("@swc/helpers/_/_create_class"), i = require("@swc/helpers/_/_define_property"), s = require("@swc/helpers/_/_inherits"), n = require("@swc/helpers/_/_interop_require_wildcard"), c = require("@swc/helpers/_/_object_spread"), _ = require("@swc/helpers/_/_object_spread_props"), o = require("react/jsx-runtime"), l = /*#__PURE__*/ function(n) {
    "use strict";
    function l() {
        var r;
        return t._(this, l), r = e._(this, l, arguments), i._(r, "storeHighlightedItemReference", function(e) {
            r.props.onHighlightedItemChange(null === e ? null : e.item);
        }), r;
    }
    return s._(l, n), r._(l, [
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
                var e = this, t = this.props, r = t.items, i = t.itemProps, s = t.renderItem, n = t.renderItemData, l = t.sectionIndex, u = t.highlightedItemIndex, p = t.getItemId, a = t.theme, d = t.keyPrefix, h = null === l ? d : "".concat(d, "section-").concat(l, "-"), m = "function" == typeof i;
                return (0, o.jsx)("ul", _._(c._({
                    role: "listbox"
                }, a("".concat(h, "items-list"), "itemsList")), {
                    children: r.map(function(t, r) {
                        var d = 0 === r, f = r === u, I = "".concat(h, "item-").concat(r), g = m ? i({
                            sectionIndex: l,
                            itemIndex: r
                        }) : i, x = c._({
                            id: p(l, r),
                            "aria-selected": f
                        }, a(I, "item", d && "itemFirst", f && "itemHighlighted"), g);
                        return f && (x.ref = e.storeHighlightedItemReference), (0, o.jsx)(Item, _._(c._({}, x), {
                            sectionIndex: l,
                            isHighlighted: f,
                            itemIndex: r,
                            item: t,
                            renderItem: s,
                            renderItemData: n
                        }));
                    })
                }));
            }
        }
    ]), l;
}(/*#__PURE__*/ n._(require("react")).Component);
i._(l, "propTypes", {
    items: 500
}), i._(l, "defaultProps", {
    sectionIndex: null
}), new l();
