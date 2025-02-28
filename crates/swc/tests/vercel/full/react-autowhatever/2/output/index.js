"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: function() {
        return e;
    }
});
var i = require("@swc/helpers/_/_call_super"), s = require("@swc/helpers/_/_class_call_check"), n = require("@swc/helpers/_/_create_class"), t = require("@swc/helpers/_/_define_property"), c = require("@swc/helpers/_/_inherits"), r = require("@swc/helpers/_/_interop_require_wildcard"), _ = require("@swc/helpers/_/_object_spread"), o = require("@swc/helpers/_/_object_spread_props"), l = require("react/jsx-runtime"), e = /*#__PURE__*/ function(r) {
    "use strict";
    function e() {
        var r;
        return s._(this, e), r = i._(this, e, arguments), t._(r, "storeHighlightedItemReference", function(e) {
            r.props.onHighlightedItemChange(null === e ? null : e.item);
        }), r;
    }
    return c._(e, r), n._(e, [
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
                var u = this, e = this.props, i = e.items, s = e.itemProps, p = e.renderItem, a = e.renderItemData, t = e.sectionIndex, d = e.highlightedItemIndex, h = e.getItemId, n = e.theme, r = e.keyPrefix, c = null === t ? r : "".concat(r, "section-").concat(t, "-"), m = "function" == typeof s;
                return (0, l.jsx)("ul", o._(_._({
                    role: "listbox"
                }, n("".concat(c, "items-list"), "itemsList")), {
                    children: i.map(function(f, e) {
                        var I = 0 === e, r = e === d, g = "".concat(c, "item-").concat(e), x = m ? s({
                            sectionIndex: t,
                            itemIndex: e
                        }) : s, i = _._({
                            id: h(t, e),
                            "aria-selected": r
                        }, n(g, "item", I && "itemFirst", r && "itemHighlighted"), x);
                        return r && (i.ref = u.storeHighlightedItemReference), (0, l.jsx)(Item, o._(_._({}, i), {
                            sectionIndex: t,
                            isHighlighted: r,
                            itemIndex: e,
                            item: f,
                            renderItem: p,
                            renderItemData: a
                        }));
                    })
                }));
            }
        }
    ]), e;
}(/*#__PURE__*/ r._(require("react")).Component);
t._(e, "propTypes", {
    items: 500
}), t._(e, "defaultProps", {
    sectionIndex: null
}), new e();
