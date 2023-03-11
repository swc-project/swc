"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: function() {
        return o;
    }
});
var e = require("@swc/helpers/lib/_assert_this_initialized.js").default, t = require("@swc/helpers/lib/_class_call_check.js").default, r = require("@swc/helpers/lib/_create_class.js").default, i = require("@swc/helpers/lib/_define_property.js").default, s = require("@swc/helpers/lib/_inherits.js").default, n = require("@swc/helpers/lib/_interop_require_wildcard.js").default, l = require("@swc/helpers/lib/_object_spread.js").default, c = require("@swc/helpers/lib/_object_spread_props.js").default, u = require("@swc/helpers/lib/_create_super.js").default, a = require("react/jsx-runtime"), o = function(n) {
    "use strict";
    s(d, n);
    var o = u(d);
    function d() {
        var r;
        return t(this, d), r = o.apply(this, arguments), i(e(r), "storeHighlightedItemReference", function(e) {
            r.props.onHighlightedItemChange(null === e ? null : e.item);
        }), r;
    }
    return r(d, [
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
                var e = this, t = this.props, r = t.items, i = t.itemProps, s = t.renderItem, n = t.renderItemData, u = t.sectionIndex, o = t.highlightedItemIndex, d = t.getItemId, p = t.theme, h = t.keyPrefix, m = null === u ? h : "".concat(h, "section-").concat(u, "-"), f = "function" == typeof i;
                return (0, a.jsx)("ul", c(l({
                    role: "listbox"
                }, p("".concat(m, "items-list"), "itemsList")), {
                    children: r.map(function(t, r) {
                        var h = r === o, _ = "".concat(m, "item-").concat(r), I = f ? i({
                            sectionIndex: u,
                            itemIndex: r
                        }) : i, j = l({
                            id: d(u, r),
                            "aria-selected": h
                        }, p(_, "item", 0 === r && "itemFirst", h && "itemHighlighted"), I);
                        return h && (j.ref = e.storeHighlightedItemReference), (0, a.jsx)(Item, c(l({}, j), {
                            sectionIndex: u,
                            isHighlighted: h,
                            itemIndex: r,
                            item: t,
                            renderItem: s,
                            renderItemData: n
                        }));
                    })
                }));
            }
        }
    ]), d;
}(n(require("react")).Component);
i(o, "propTypes", {
    items: 500
}), i(o, "defaultProps", {
    sectionIndex: null
}), new o();
