function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return call && ("object" == typeof call || "function" == typeof call) ? call : self;
}
function _inherits(subClass, superClass) {
    if ("function" != typeof superClass && null !== superClass) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
function ItemsList() {
    _classCallCheck(this, ItemsList);
    for (var _ref, _temp, _this, _ret, _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }
    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ItemsList.__proto__ || Object.getPrototypeOf(ItemsList)).call.apply(_ref, [
        this
    ].concat(args))), _this), _this.storeHighlightedItemReference = function (highlightedItem) {
        _this.props.onHighlightedItemChange(null === highlightedItem ? null : highlightedItem.item);
    }, _temp), _possibleConstructorReturn(_this, _ret);
}
new ItemsList();
console.log("PASS");