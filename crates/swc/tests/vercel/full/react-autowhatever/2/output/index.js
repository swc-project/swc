"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: function() {
        return u;
    }
});
var e = require("@swc/helpers/_/_call_super"), t = require("@swc/helpers/_/_class_call_check"), r = require("@swc/helpers/_/_create_class"), i = require("@swc/helpers/_/_define_property"), s = require("@swc/helpers/_/_inherits"), n = require("@swc/helpers/_/_interop_require_wildcard"), c = require("@swc/helpers/_/_object_spread"), o = require("@swc/helpers/_/_object_spread_props"), l = require("react/jsx-runtime"), u = /*#__PURE__*/ function(n) {
    "use strict";
    function u() {
        var r;
        return t._(this, u), r = e._(this, u, arguments), i._(r, "storeHighlightedItemReference", function(e) {
            r.props.onHighlightedItemChange(null === e ? null : e.item);
        }), r;
    }
    return s._(u, n), r._(u, [
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
                var e = this, t = this.props, r = t.items, i = t.itemProps, s = t.renderItem, n = t.renderItemData, u = t.sectionIndex, _ = t.highlightedItemIndex, p = t.getItemId, a = t.theme, d = t.keyPrefix, h = null === u ? d : "".concat(d, "section-").concat(u, "-"), m = "function" == typeof i;
                return /*#__PURE__*/ (0, l.jsx)("ul", o._(c._({
                    role: "listbox"
                }, a("".concat(h, "items-list"), "itemsList")), {
                    children: r.map(function(t, r) {
                        var d = 0 === r, f = r === _, I = "".concat(h, "item-").concat(r), g = m ? i({
                            sectionIndex: u,
                            itemIndex: r
                        }) : i, x = c._({
                            id: p(u, r),
                            "aria-selected": f
                        }, a(I, "item", d && "itemFirst", f && "itemHighlighted"), g);
                        return f && (x.ref = e.storeHighlightedItemReference), /*#__PURE__*/ (0, l.jsx)(Item, o._(c._({}, x), {
                            sectionIndex: u,
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
    ]), u;
}(/*#__PURE__*/ n._(require("react")).Component);
i._(u, "propTypes", {
    items: 500
}), i._(u, "defaultProps", {
    sectionIndex: null
}), new u();
