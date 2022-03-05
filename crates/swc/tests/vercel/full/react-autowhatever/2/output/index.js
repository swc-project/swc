"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), exports.default = void 0;
var b = require("@swc/helpers"), c = require("react/jsx-runtime"), a = function(d) {
    "use strict";
    b.inherits(a, d);
    var e = b.createSuper(a);
    function a() {
        var c;
        return b.classCallCheck(this, a), c = e.apply(this, arguments), c.storeHighlightedItemReference = function(a) {
            c.props.onHighlightedItemChange(null === a ? null : a.item);
        }, c;
    }
    return b.createClass(a, [
        {
            key: "shouldComponentUpdate",
            value: function(a) {
                return compareObjects(a, this.props, [
                    "itemProps"
                ]);
            }
        },
        {
            key: "render",
            value: function() {
                var j = this, a = this.props, f = a.items, g = a.itemProps, k = a.renderItem, l = a.renderItemData, d = a.sectionIndex, m = a.highlightedItemIndex, n = a.getItemId, h = a.theme, e = a.keyPrefix, i = null === d ? e : "".concat(e, "section-").concat(d, "-"), o = "function" == typeof g;
                return c.jsx("ul", b.objectSpread({
                    role: "listbox"
                }, h("".concat(i, "items-list"), "itemsList"), {
                    children: f.map(function(p, a) {
                        var e = a === m, q = "".concat(i, "item-").concat(a), r = o ? g({
                            sectionIndex: d,
                            itemIndex: a
                        }) : g, f = b.objectSpread({
                            id: n(d, a),
                            "aria-selected": e
                        }, h(q, "item", 0 === a && "itemFirst", e && "itemHighlighted"), r);
                        return e && (f.ref = j.storeHighlightedItemReference), c.jsx(Item, b.objectSpread({}, f, {
                            sectionIndex: d,
                            isHighlighted: e,
                            itemIndex: a,
                            item: p,
                            renderItem: k,
                            renderItemData: l
                        }));
                    })
                }));
            }
        }
    ]), a;
}(b.interopRequireWildcard(require("react")).Component);
exports.default = a, a.propTypes = {
    items: 500
}, a.defaultProps = {
    sectionIndex: null
}, new a();
