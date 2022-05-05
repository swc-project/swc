"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true,
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

// var _Item = _interopRequireDefault(require("./Item"));

// var _compareObjects = _interopRequireDefault(require("./compareObjects"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _getRequireWildcardCache() {
    if (typeof WeakMap !== "function") return null;
    var cache = new WeakMap();
    _getRequireWildcardCache = function _getRequireWildcardCache() {
        return cache;
    };
    return cache;
}

function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    }
    if (
        obj === null ||
        (_typeof(obj) !== "object" && typeof obj !== "function")
    ) {
        return { default: obj };
    }
    var cache = _getRequireWildcardCache();
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor =
        Object.defineProperty && Object.getOwnPropertyDescriptor;
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor
                ? Object.getOwnPropertyDescriptor(obj, key)
                : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj["default"] = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}

function _typeof(obj) {
    "@babel/helpers - typeof";
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof = function _typeof(obj) {
            return typeof obj;
        };
    } else {
        _typeof = function _typeof(obj) {
            return obj &&
                typeof Symbol === "function" &&
                obj.constructor === Symbol &&
                obj !== Symbol.prototype
                ? "symbol"
                : typeof obj;
        };
    }
    return _typeof(obj);
}

function _extends() {
    _extends =
        Object.assign ||
        function (target) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
            return target;
        };
    return _extends.apply(this, arguments);
}

function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly)
            symbols = symbols.filter(function (sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        keys.push.apply(keys, symbols);
    }
    return keys;
}

function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};
        if (i % 2) {
            ownKeys(Object(source), true).forEach(function (key) {
                _defineProperty(target, key, source[key]);
            });
        } else if (Object.getOwnPropertyDescriptors) {
            Object.defineProperties(
                target,
                Object.getOwnPropertyDescriptors(source)
            );
        } else {
            ownKeys(Object(source)).forEach(function (key) {
                Object.defineProperty(
                    target,
                    key,
                    Object.getOwnPropertyDescriptor(source, key)
                );
            });
        }
    }
    return target;
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}

function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}

function _createSuper(Derived) {
    return function () {
        var Super = _getPrototypeOf(Derived),
            result;
        if (_isNativeReflectConstruct()) {
            var NewTarget = _getPrototypeOf(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
        } else {
            result = Super.apply(this, arguments);
        }
        return _possibleConstructorReturn(this, result);
    };
}

function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
        return call;
    }
    return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
    if (self === void 0) {
        throw new ReferenceError(
            "this hasn't been initialised - super() hasn't been called"
        );
    }
    return self;
}

function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
        Date.prototype.toString.call(
            Reflect.construct(Date, [], function () {})
        );
        return true;
    } catch (e) {
        return false;
    }
}

function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf
        ? Object.getPrototypeOf
        : function _getPrototypeOf(o) {
              return o.__proto__ || Object.getPrototypeOf(o);
          };
    return _getPrototypeOf(o);
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError(
            "Super expression must either be null or a function"
        );
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: { value: subClass, writable: true, configurable: true },
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
    _setPrototypeOf =
        Object.setPrototypeOf ||
        function _setPrototypeOf(o, p) {
            o.__proto__ = p;
            return o;
        };
    return _setPrototypeOf(o, p);
}

function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true,
        });
    } else {
        obj[key] = value;
    }
    return obj;
}

var ItemsList = /*#__PURE__*/ (function (_Component) {
    _inherits(ItemsList, _Component);

    var _super = _createSuper(ItemsList);

    function ItemsList() {
        function _assertThisInitialized(self) {
            if (self === void 0) {
                throw new ReferenceError(
                    "this hasn't been initialised - super() hasn't been called"
                );
            }
            return self;
        }
        function _defineProperty(obj, key, value) {
            if (key in obj) {
                Object.defineProperty(obj, key, {
                    value: value,
                    enumerable: true,
                    configurable: true,
                    writable: true,
                });
            } else {
                obj[key] = value;
            }
            return obj;
        }

        var _this;

        _classCallCheck(this, ItemsList);

        for (
            var _len = arguments.length, args = new Array(_len), _key = 0;
            _key < _len;
            _key++
        ) {
            args[_key] = arguments[_key];
        }

        _this = _super.call.apply(_super, [this].concat(args));

        _defineProperty(
            _assertThisInitialized(_this),
            "storeHighlightedItemReference",
            function (highlightedItem) {
                _this.props.onHighlightedItemChange(
                    highlightedItem === null ? null : highlightedItem.item
                );
            }
        );

        return _this;
    }

    _createClass(ItemsList, [
        {
            key: "shouldComponentUpdate",
            value: function shouldComponentUpdate(nextProps) {
                return (0, _compareObjects["default"])(nextProps, this.props, [
                    "itemProps",
                ]);
            },
        },
        {
            key: "render",
            value: function render() {
                var _this2 = this;

                var _this$props = this.props,
                    items = _this$props.items,
                    itemProps = _this$props.itemProps,
                    renderItem = _this$props.renderItem,
                    renderItemData = _this$props.renderItemData,
                    sectionIndex = _this$props.sectionIndex,
                    highlightedItemIndex = _this$props.highlightedItemIndex,
                    getItemId = _this$props.getItemId,
                    theme = _this$props.theme,
                    keyPrefix = _this$props.keyPrefix;
                var sectionPrefix =
                    sectionIndex === null
                        ? keyPrefix
                        : ""
                              .concat(keyPrefix, "section-")
                              .concat(sectionIndex, "-");
                var isItemPropsFunction = typeof itemProps === "function";
                return /*#__PURE__*/ _react["default"].createElement(
                    "ul",
                    _extends(
                        {
                            role: "listbox",
                        },
                        theme(
                            "".concat(sectionPrefix, "items-list"),
                            "itemsList"
                        )
                    ),
                    items.map(function (item, itemIndex) {
                        var isFirst = itemIndex === 0;
                        var isHighlighted = itemIndex === highlightedItemIndex;
                        var itemKey = ""
                            .concat(sectionPrefix, "item-")
                            .concat(itemIndex);
                        var itemPropsObj = isItemPropsFunction
                            ? itemProps({
                                  sectionIndex: sectionIndex,
                                  itemIndex: itemIndex,
                              })
                            : itemProps;

                        var allItemProps = _objectSpread(
                            {
                                id: getItemId(sectionIndex, itemIndex),
                                "aria-selected": isHighlighted,
                            },
                            theme(
                                itemKey,
                                "item",
                                isFirst && "itemFirst",
                                isHighlighted && "itemHighlighted"
                            ),
                            {},
                            itemPropsObj
                        );

                        if (isHighlighted) {
                            allItemProps.ref =
                                _this2.storeHighlightedItemReference;
                        } // `key` is provided by theme()

                        /* eslint-disable react/jsx-key */

                        return /*#__PURE__*/ _react["default"].createElement(
                            _Item["default"],
                            _extends({}, allItemProps, {
                                sectionIndex: sectionIndex,
                                isHighlighted: isHighlighted,
                                itemIndex: itemIndex,
                                item: item,
                                renderItem: renderItem,
                                renderItemData: renderItemData,
                            })
                        );
                        /* eslint-enable react/jsx-key */
                    })
                );
            },
        },
    ]);

    return ItemsList;
})(_react.Component);

exports["default"] = ItemsList;

_defineProperty(ItemsList, "propTypes", {
    items: _propTypes["default"].array.isRequired,
    itemProps: _propTypes["default"].oneOfType([
        _propTypes["default"].object,
        _propTypes["default"].func,
    ]),
    renderItem: _propTypes["default"].func.isRequired,
    renderItemData: _propTypes["default"].object.isRequired,
    sectionIndex: _propTypes["default"].number,
    highlightedItemIndex: _propTypes["default"].number,
    onHighlightedItemChange: _propTypes["default"].func.isRequired,
    getItemId: _propTypes["default"].func.isRequired,
    theme: _propTypes["default"].func.isRequired,
    keyPrefix: _propTypes["default"].string.isRequired,
});

_defineProperty(ItemsList, "defaultProps", {
    sectionIndex: null,
});

const a = new ItemsList();
