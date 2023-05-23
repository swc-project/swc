"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: function() {
        return p;
    }
});
var e = require("@swc/helpers/_/_assert_this_initialized"), t = require("@swc/helpers/_/_class_call_check"), r = require("@swc/helpers/_/_create_class"), i = require("@swc/helpers/_/_define_property"), n = require("@swc/helpers/_/_inherits"), s = require("@swc/helpers/_/_interop_require_default"), u = require("@swc/helpers/_/_interop_require_wildcard"), d = require("@swc/helpers/_/_object_spread"), c = require("@swc/helpers/_/_object_spread_props"), l = require("@swc/helpers/_/_create_super"), a = require("react/jsx-runtime"), o = u._(require("react")), _ = s._(require("prop-types")), p = function(s) {
    "use strict";
    n._(o, s);
    var u = l._(o);
    function o() {
        var r;
        return t._(this, o), r = u.apply(this, arguments), i._(e._(r), "storeHighlightedItemReference", function(e) {
            r.props.onHighlightedItemChange(null === e ? null : e.item);
        }), r;
    }
    return r._(o, [
        {
            key: "shouldComponentUpdate",
            value: function(e) {
                return !0;
            }
        },
        {
            key: "render",
            value: function() {
                var e = this, t = this.props, r = t.items, i = t.itemProps, n = t.renderItem, s = t.renderItemData, u = t.sectionIndex, l = t.highlightedItemIndex, o = t.getItemId, _ = t.theme, p = t.keyPrefix, h = null === u ? p : "".concat(p, "section-").concat(u, "-"), f = "function" == typeof i;
                return (0, a.jsx)("ul", c._(d._({
                    role: "listbox"
                }, _("".concat(h, "items-list"), "itemsList")), {
                    children: r.map(function(t, r) {
                        var p = 0 === r, m = r === l, I = "".concat(h, "item-").concat(r), g = f ? i({
                            sectionIndex: u,
                            itemIndex: r
                        }) : i, q = d._({
                            id: o(u, r),
                            "aria-selected": m
                        }, _(I, "item", p && "itemFirst", m && "itemHighlighted"), g);
                        return m && (q.ref = e.storeHighlightedItemReference), (0, a.jsx)(Item, c._(d._({}, q), {
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
    ]), o;
}(o.Component);
i._(p, "propTypes", {
    items: _.default.array.isRequired,
    itemProps: _.default.oneOfType([
        _.default.object,
        _.default.func
    ]),
    renderItem: _.default.func.isRequired,
    renderItemData: _.default.object.isRequired,
    sectionIndex: _.default.number,
    highlightedItemIndex: _.default.number,
    onHighlightedItemChange: _.default.func.isRequired,
    getItemId: _.default.func.isRequired,
    theme: _.default.func.isRequired,
    keyPrefix: _.default.string.isRequired
}), i._(p, "defaultProps", {
    sectionIndex: null
}), new p();
