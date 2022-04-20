function ItemsList() {
    _classCallCheck(this, ItemsList);
    for(var _ref, _temp, _this, _ret, _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
    return _ret = (_temp = _this = _possibleConstructorReturn(this, (_ref = ItemsList.__proto__ || Object.getPrototypeOf(ItemsList)).call.apply(_ref, [
        this
    ].concat(args))), _this.storeHighlightedItemReference = function(highlightedItem) {
        _this.props.onHighlightedItemChange(null === highlightedItem ? null : highlightedItem.item);
    }, _temp), _possibleConstructorReturn(_this, _ret);
}
