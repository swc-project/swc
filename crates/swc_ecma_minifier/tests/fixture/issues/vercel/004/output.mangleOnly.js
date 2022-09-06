export function ItemsList() {
    var t;
    var e, s, r;
    _classCallCheck(this, ItemsList);
    for(var o = arguments.length, i = Array(o), n = 0; n < o; n++){
        i[n] = arguments[n];
    }
    return ((r = ((e = ((s = _possibleConstructorReturn(this, (t = ItemsList.__proto__ || Object.getPrototypeOf(ItemsList)).call.apply(t, [
        this
    ].concat(i)))), s)), (s.storeHighlightedItemReference = function(t) {
        s.props.onHighlightedItemChange(t === null ? null : t.item);
    }), e)), _possibleConstructorReturn(s, r));
}
