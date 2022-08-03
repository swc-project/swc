function t() {
    var e;
    var n, o, r;
    _classCallCheck(this, t);
    for(var i = arguments.length, l = Array(i), h = 0; h < i; h++){
        l[h] = arguments[h];
    }
    return ((r = ((n = ((o = _possibleConstructorReturn(this, (e = t.__proto__ || Object.getPrototypeOf(t)).call.apply(e, [
        this
    ].concat(l)))), o)), (o.storeHighlightedItemReference = function(t) {
        o.props.onHighlightedItemChange(t === null ? null : t.item);
    }), n)), _possibleConstructorReturn(o, r));
}
