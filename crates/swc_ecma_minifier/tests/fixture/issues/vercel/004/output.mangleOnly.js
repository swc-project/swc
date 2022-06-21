function a() {
    var b;
    var c, d, e;
    _classCallCheck(this, a);
    for(var f = arguments.length, g = Array(f), h = 0; h < f; h++){
        g[h] = arguments[h];
    }
    return ((e = ((c = ((d = _possibleConstructorReturn(this, (b = a.__proto__ || Object.getPrototypeOf(a)).call.apply(b, [
        this
    ].concat(g)))), d)), (d.storeHighlightedItemReference = function(a) {
        d.props.onHighlightedItemChange(a === null ? null : a.item);
    }), c)), _possibleConstructorReturn(d, e));
}
