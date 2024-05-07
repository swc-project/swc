"use strict";
var _instanceof = require("@swc/helpers/_/_instanceof");
Object.defineProperty(exports, "__esModule", {
    value: !0
}), exports.default = void 0;
var _react = function(obj) {
    if (obj && obj.__esModule) return obj;
    if (null === obj || "object" !== _typeof(obj) && "function" != typeof obj) return {
        default: obj
    };
    var cache = _getRequireWildcardCache();
    if (cache && cache.has(obj)) return cache.get(obj);
    var newObj = {}, hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj)if (Object.prototype.hasOwnProperty.call(obj, key)) {
        var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
        desc && (desc.get || desc.set) ? Object.defineProperty(newObj, key, desc) : newObj[key] = obj[key];
    }
    return newObj.default = obj, cache && cache.set(obj, newObj), newObj;
}(require("react")), _propTypes = _interopRequireDefault(require("prop-types")), _Item = _interopRequireDefault(require("./Item")), _compareObjects = _interopRequireDefault(require("./compareObjects"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache() {
    if ("function" != typeof WeakMap) return null;
    var cache = new WeakMap();
    return _getRequireWildcardCache = function() {
        return cache;
    }, cache;
}
function _typeof(obj) {
    return (_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
        return typeof obj;
    } : function(obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    })(obj);
}
function _extends() {
    return (_extends = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source)Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }).apply(this, arguments);
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys.push.apply(keys, symbols);
    }
    return keys;
}
function _assertThisInitialized(self) {
    if (void 0 === self) throw ReferenceError("this hasn't been initialised - super() hasn't been called");
    return self;
}
function _getPrototypeOf(o) {
    return (_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    })(o);
}
function _setPrototypeOf(o, p) {
    return (_setPrototypeOf = Object.setPrototypeOf || function(o, p) {
        return o.__proto__ = p, o;
    })(o, p);
}
function _defineProperty(obj, key, value) {
    return key in obj ? Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : obj[key] = value, obj;
}
var ItemsList = function(_Component) {
    !function(subClass, superClass) {
        if ("function" != typeof superClass && null !== superClass) throw TypeError("Super expression must either be null or a function");
        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                writable: !0,
                configurable: !0
            }
        }), superClass && _setPrototypeOf(subClass, superClass);
    }(ItemsList, _Component);
    var protoProps, _super = function() {
        var result, Super = _getPrototypeOf(ItemsList);
        return result = !function() {
            if ("undefined" == typeof Reflect || !Reflect.construct || Reflect.construct.sham) return !1;
            if ("function" == typeof Proxy) return !0;
            try {
                return Date.prototype.toString.call(Reflect.construct(Date, [], function() {})), !0;
            } catch (e) {
                return !1;
            }
        }() ? Super.apply(this, arguments) : Reflect.construct(Super, arguments, _getPrototypeOf(this).constructor), result && ("object" === _typeof(result) || "function" == typeof result) ? result : _assertThisInitialized(this);
    };
    function ItemsList() {
        var _this;
        !function(instance, Constructor) {
            if (!_instanceof._(instance, Constructor)) throw TypeError("Cannot call a class as a function");
        }(this, ItemsList);
        for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
        return _defineProperty(_assertThisInitialized(_this = _super.call.apply(_super, [
            this
        ].concat(args))), "storeHighlightedItemReference", function(highlightedItem) {
            _this.props.onHighlightedItemChange(null === highlightedItem ? null : highlightedItem.item);
        }), _this;
    }
    return protoProps = [
        {
            key: "shouldComponentUpdate",
            value: function(nextProps) {
                return (0, _compareObjects.default)(nextProps, this.props, [
                    "itemProps"
                ]);
            }
        },
        {
            key: "render",
            value: function() {
                var _this2 = this, _this$props = this.props, items = _this$props.items, itemProps = _this$props.itemProps, renderItem = _this$props.renderItem, renderItemData = _this$props.renderItemData, sectionIndex = _this$props.sectionIndex, highlightedItemIndex = _this$props.highlightedItemIndex, getItemId = _this$props.getItemId, theme = _this$props.theme, keyPrefix = _this$props.keyPrefix, sectionPrefix = null === sectionIndex ? keyPrefix : "".concat(keyPrefix, "section-").concat(sectionIndex, "-"), isItemPropsFunction = "function" == typeof itemProps;
                return _react.default.createElement("ul", _extends({
                    role: "listbox"
                }, theme("".concat(sectionPrefix, "items-list"), "itemsList")), items.map(function(item, itemIndex) {
                    var isFirst = 0 === itemIndex, isHighlighted = itemIndex === highlightedItemIndex, itemKey = "".concat(sectionPrefix, "item-").concat(itemIndex), itemPropsObj = isItemPropsFunction ? itemProps({
                        sectionIndex: sectionIndex,
                        itemIndex: itemIndex
                    }) : itemProps, allItemProps = function(target) {
                        for(var i = 1; i < arguments.length; i++){
                            var source = null != arguments[i] ? arguments[i] : {};
                            i % 2 ? ownKeys(Object(source), !0).forEach(function(key) {
                                _defineProperty(target, key, source[key]);
                            }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
                                Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
                            });
                        }
                        return target;
                    }({
                        id: getItemId(sectionIndex, itemIndex),
                        "aria-selected": isHighlighted
                    }, theme(itemKey, "item", isFirst && "itemFirst", isHighlighted && "itemHighlighted"), {}, itemPropsObj);
                    return isHighlighted && (allItemProps.ref = _this2.storeHighlightedItemReference), _react.default.createElement(_Item.default, _extends({}, allItemProps, {
                        sectionIndex: sectionIndex,
                        isHighlighted: isHighlighted,
                        itemIndex: itemIndex,
                        item: item,
                        renderItem: renderItem,
                        renderItemData: renderItemData
                    }));
                }));
            }
        }
    ], function(target, props) {
        for(var i = 0; i < props.length; i++){
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
    }(ItemsList.prototype, protoProps), ItemsList;
}(_react.Component);
exports.default = ItemsList, _defineProperty(ItemsList, "propTypes", {
    items: _propTypes.default.array.isRequired,
    itemProps: _propTypes.default.oneOfType([
        _propTypes.default.object,
        _propTypes.default.func
    ]),
    renderItem: _propTypes.default.func.isRequired,
    renderItemData: _propTypes.default.object.isRequired,
    sectionIndex: _propTypes.default.number,
    highlightedItemIndex: _propTypes.default.number,
    onHighlightedItemChange: _propTypes.default.func.isRequired,
    getItemId: _propTypes.default.func.isRequired,
    theme: _propTypes.default.func.isRequired,
    keyPrefix: _propTypes.default.string.isRequired
}), _defineProperty(ItemsList, "defaultProps", {
    sectionIndex: null
});
