"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: function() {
        return l;
    }
});
var e = require("@swc/helpers/_/_call_super"), r = require("@swc/helpers/_/_class_call_check"), t = require("@swc/helpers/_/_create_class"), i = require("@swc/helpers/_/_define_property"), n = require("@swc/helpers/_/_inherits");
require("@swc/helpers/_/_interop_require_default");
var s = require("@swc/helpers/_/_interop_require_wildcard"), _ = require("@swc/helpers/_/_object_spread"), c = require("@swc/helpers/_/_object_spread_props"), u = require("react/jsx-runtime"), o = /*#__PURE__*/ s._(require("react"));
/*#__PURE__*/ require("prop-types");
var l = /*#__PURE__*/ function(s) {
    "use strict";
    function o() {
        var t;
        return r._(this, o), t = e._(this, o, arguments), i._(t, "storeHighlightedItemReference", function(e) {
            t.props.onHighlightedItemChange(null === e ? null : e.item);
        }), t;
    }
    return n._(o, s), t._(o, [
        {
            key: "shouldComponentUpdate",
            value: function(e) {
                return !0;
            }
        },
        {
            key: "render",
            value: function() {
                var e = this, r = this.props, t = r.items, i = r.itemProps, n = r.renderItem, s = r.renderItemData, o = r.sectionIndex, l = r.highlightedItemIndex, a = r.getItemId, p = r.theme, d = r.keyPrefix, h = null === o ? d : "".concat(d, "section-").concat(o, "-"), m = "function" == typeof i;
                return (0, u.jsx)("ul", c._(_._({
                    role: "listbox"
                }, p("".concat(h, "items-list"), "itemsList")), {
                    children: t.map(function(r, t) {
                        var d = 0 === t, f = t === l, I = "".concat(h, "item-").concat(t), g = m ? i({
                            sectionIndex: o,
                            itemIndex: t
                        }) : i, q = _._({
                            id: a(o, t),
                            "aria-selected": f
                        }, p(I, "item", d && "itemFirst", f && "itemHighlighted"), g);
                        return f && (q.ref = e.storeHighlightedItemReference), (0, u.jsx)(Item, c._(_._({}, q), {
                            sectionIndex: o,
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
    ]), o;
}(o.Component);
new l();
