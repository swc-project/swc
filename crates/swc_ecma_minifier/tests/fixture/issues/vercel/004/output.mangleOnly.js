function a() {
    var d;
    var e, b, f;
    _classCallCheck(this, a);
    for(var g = arguments.length, h = Array(g), c = 0; c < g; c++){
        h[c] = arguments[c];
    }
    return ((f = ((e = ((b = _possibleConstructorReturn(this, (d = a.__proto__ || Object.getPrototypeOf(a)).call.apply(d, [
        this
    ].concat(h)))), b)), (b.storeHighlightedItemReference = function(a) {
        b.props.onHighlightedItemChange(a === null ? null : a.item);
    }), e)), _possibleConstructorReturn(b, f));
}
