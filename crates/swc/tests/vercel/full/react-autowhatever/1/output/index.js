"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: function() {
        return t;
    }
});
var u = require("@swc/helpers/_/_call_super"), d = require("@swc/helpers/_/_class_call_check"), c = require("@swc/helpers/_/_create_class"), r = require("@swc/helpers/_/_define_property"), l = require("@swc/helpers/_/_inherits"), i = require("@swc/helpers/_/_interop_require_default"), n = require("@swc/helpers/_/_interop_require_wildcard"), _ = require("@swc/helpers/_/_object_spread"), a = require("@swc/helpers/_/_object_spread_props"), o = require("react/jsx-runtime"), s = /*#__PURE__*/ n._(require("react")), e = /*#__PURE__*/ i._(require("prop-types")), t = /*#__PURE__*/ function(t) {
    "use strict";
    function e() {
        var t;
        return d._(this, e), t = u._(this, e, arguments), r._(t, "storeHighlightedItemReference", function(e) {
            t.props.onHighlightedItemChange(null === e ? null : e.item);
        }), t;
    }
    return l._(e, t), c._(e, [
        {
            key: "shouldComponentUpdate",
            value: function(e) {
                return !0;
            }
        },
        {
            key: "render",
            value: function() {
                var d = this, e = this.props, i = e.items, n = e.itemProps, c = e.renderItem, l = e.renderItemData, t = e.sectionIndex, p = e.highlightedItemIndex, h = e.getItemId, s = e.theme, r = e.keyPrefix, u = null === t ? r : "".concat(r, "section-").concat(t, "-"), f = "function" == typeof n;
                return (0, o.jsx)("ul", a._(_._({
                    role: "listbox"
                }, s("".concat(u, "items-list"), "itemsList")), {
                    children: i.map(function(m, e) {
                        var I = 0 === e, r = e === p, g = "".concat(u, "item-").concat(e), q = f ? n({
                            sectionIndex: t,
                            itemIndex: e
                        }) : n, i = _._({
                            id: h(t, e),
                            "aria-selected": r
                        }, s(g, "item", I && "itemFirst", r && "itemHighlighted"), q);
                        return r && (i.ref = d.storeHighlightedItemReference), (0, o.jsx)(Item, a._(_._({}, i), {
                            sectionIndex: t,
                            isHighlighted: r,
                            itemIndex: e,
                            item: m,
                            renderItem: c,
                            renderItemData: l
                        }));
                    })
                }));
            }
        }
    ]), e;
}(s.Component);
r._(t, "propTypes", {
    items: e.default.array.isRequired,
    itemProps: e.default.oneOfType([
        e.default.object,
        e.default.func
    ]),
    renderItem: e.default.func.isRequired,
    renderItemData: e.default.object.isRequired,
    sectionIndex: e.default.number,
    highlightedItemIndex: e.default.number,
    onHighlightedItemChange: e.default.func.isRequired,
    getItemId: e.default.func.isRequired,
    theme: e.default.func.isRequired,
    keyPrefix: e.default.string.isRequired
}), r._(t, "defaultProps", {
    sectionIndex: null
}), new t();
