"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: function() {
        return l;
    }
});
var e = require("@swc/helpers/_/_call_super"), t = require("@swc/helpers/_/_class_call_check"), r = require("@swc/helpers/_/_create_class"), i = require("@swc/helpers/_/_define_property"), n = require("@swc/helpers/_/_inherits"), s = require("@swc/helpers/_/_object_spread"), c = require("@swc/helpers/_/_object_spread_props"), o = require("react/jsx-runtime"), l = /*#__PURE__*/ function(l) {
    "use strict";
    function u() {
        var r;
        return t._(this, u), r = e._(this, u, arguments), i._(r, "storeHighlightedItemReference", function(e) {
            r.props.onHighlightedItemChange(null === e ? null : e.item);
        }), r;
    }
    return n._(u, l), r._(u, [
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
                var e = this, t = this.props, r = t.items, i = t.itemProps, n = t.renderItem, l = t.renderItemData, u = t.sectionIndex, _ = t.highlightedItemIndex, p = t.getItemId, a = t.theme, d = t.keyPrefix, h = null === u ? d : "".concat(d, "section-").concat(u, "-"), m = "function" == typeof i;
                return (0, o.jsx)("ul", c._(s._({
                    role: "listbox"
                }, a("".concat(h, "items-list"), "itemsList")), {
                    children: r.map(function(t, r) {
                        var d = 0 === r, f = r === _, I = "".concat(h, "item-").concat(r), g = m ? i({
                            sectionIndex: u,
                            itemIndex: r
                        }) : i, x = s._({
                            id: p(u, r),
                            "aria-selected": f
                        }, a(I, "item", d && "itemFirst", f && "itemHighlighted"), g);
                        return f && (x.ref = e.storeHighlightedItemReference), (0, o.jsx)(Item, c._(s._({}, x), {
                            sectionIndex: u,
                            isHighlighted: f,
                            itemIndex: r,
                            item: t,
                            renderItem: n,
                            renderItemData: l
                        }));
                    })
                }));
            }
        }
    ]), u;
}(require("react").Component);
i._(l, "propTypes", {
    items: 500
}), i._(l, "defaultProps", {
    sectionIndex: null
}), new l();
