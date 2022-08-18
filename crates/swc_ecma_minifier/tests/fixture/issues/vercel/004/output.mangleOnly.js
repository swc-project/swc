export function ItemsList() {
    var t;
    var e, i, s;
    _classCallCheck(this, ItemsList);
    for(var n = arguments.length, o = Array(n), r = 0; r < n; r++){
        o[r] = arguments[r];
    }
    return ((s = ((e = ((i = _possibleConstructorReturn(this, (t = ItemsList.__proto__ || Object.getPrototypeOf(ItemsList)).call.apply(t, [
        this
    ].concat(o)))), i)), (i.storeHighlightedItemReference = function(t) {
        i.props.onHighlightedItemChange(t === null ? null : t.item);
    }), e)), _possibleConstructorReturn(i, s));
}
