"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: function() {
        return u;
    }
});
var e = require("@swc/helpers/_/_assert_this_initialized"), r = require("@swc/helpers/_/_class_call_check"), t = require("@swc/helpers/_/_create_class"), i = require("@swc/helpers/_/_define_property"), s = require("@swc/helpers/_/_inherits"), n = require("@swc/helpers/_/_interop_require_wildcard"), c = require("@swc/helpers/_/_object_spread"), o = require("@swc/helpers/_/_object_spread_props"), _ = require("@swc/helpers/_/_create_super"), l = require("react/jsx-runtime"), u = function(n) {
    "use strict";
    s._(p, n);
    var u = _._(p);
    function p() {
        var t;
        return r._(this, p), t = u.apply(this, arguments), i._(e._(t), "storeHighlightedItemReference", function(e) {
            t.props.onHighlightedItemChange(null === e ? null : e.item);
        }), t;
    }
    return t._(p, [
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
                var e = this, r = this.props, t = r.items, i = r.itemProps, s = r.renderItem, n = r.renderItemData, _ = r.sectionIndex, u = r.highlightedItemIndex, p = r.getItemId, a = r.theme, d = r.keyPrefix, h = null === _ ? d : "".concat(d, "section-").concat(_, "-"), m = "function" == typeof i;
                return (0, l.jsx)("ul", o._(c._({
                    role: "listbox"
                }, a("".concat(h, "items-list"), "itemsList")), {
                    children: t.map(function(r, t) {
                        var d = 0 === t, f = t === u, I = "".concat(h, "item-").concat(t), g = m ? i({
                            sectionIndex: _,
                            itemIndex: t
                        }) : i, x = c._({
                            id: p(_, t),
                            "aria-selected": f
                        }, a(I, "item", d && "itemFirst", f && "itemHighlighted"), g);
                        return f && (x.ref = e.storeHighlightedItemReference), (0, l.jsx)(Item, o._(c._({}, x), {
                            sectionIndex: _,
                            isHighlighted: f,
                            itemIndex: t,
                            item: r,
                            renderItem: s,
                            renderItemData: n
                        }));
                    })
                }));
            }
        }
    ]), p;
}(n._(require("react")).Component);
i._(u, "propTypes", {
    items: 500
}), i._(u, "defaultProps", {
    sectionIndex: null
}), new u();
