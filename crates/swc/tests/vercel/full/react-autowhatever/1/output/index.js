"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), exports.default = void 0;
var c = require("@swc/helpers"), e = require("react/jsx-runtime"), d = c.interopRequireWildcard(require("react")), a = c.interopRequireDefault(require("prop-types")), b = function(d) {
    "use strict";
    c.inherits(b, d);
    var f = c.createSuper(b);
    function b() {
        var a;
        return c.classCallCheck(this, b), a = f.apply(this, arguments), a.storeHighlightedItemReference = function(b) {
            a.props.onHighlightedItemChange(null === b ? null : b.item);
        }, a;
    }
    var a = b.prototype;
    return a.shouldComponentUpdate = function(a) {
        return !0;
    }, a.render = function() {
        var j = this, a = this.props, f = a.items, g = a.itemProps, k = a.renderItem, l = a.renderItemData, b = a.sectionIndex, m = a.highlightedItemIndex, n = a.getItemId, h = a.theme, d = a.keyPrefix, i = null === b ? d : "".concat(d, "section-").concat(b, "-"), o = "function" == typeof g;
        return e.jsx("ul", c.objectSpread({
            role: "listbox"
        }, h("".concat(i, "items-list"), "itemsList"), {
            children: f.map(function(p, a) {
                var d = a === m, q = "".concat(i, "item-").concat(a), r = o ? g({
                    sectionIndex: b,
                    itemIndex: a
                }) : g, f = c.objectSpread({
                    id: n(b, a),
                    "aria-selected": d
                }, h(q, "item", 0 === a && "itemFirst", d && "itemHighlighted"), r);
                return d && (f.ref = j.storeHighlightedItemReference), e.jsx(Item, c.objectSpread({}, f, {
                    sectionIndex: b,
                    isHighlighted: d,
                    itemIndex: a,
                    item: p,
                    renderItem: k,
                    renderItemData: l
                }));
            })
        }));
    }, b;
}(d.Component);
b.propTypes = {
    items: a.default.array.isRequired,
    itemProps: a.default.oneOfType([
        a.default.object,
        a.default.func
    ]),
    renderItem: a.default.func.isRequired,
    renderItemData: a.default.object.isRequired,
    sectionIndex: a.default.number,
    highlightedItemIndex: a.default.number,
    onHighlightedItemChange: a.default.func.isRequired,
    getItemId: a.default.func.isRequired,
    theme: a.default.func.isRequired,
    keyPrefix: a.default.string.isRequired
}, b.defaultProps = {
    sectionIndex: null
}, new b(), exports.default = b;
