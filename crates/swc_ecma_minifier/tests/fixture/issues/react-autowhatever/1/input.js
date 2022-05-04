import { jsx as _jsx } from "react/jsx-runtime";
import React, { Component } from "react";
import PropTypes from "prop-types";
import Item from "./Item";
import compareObjects from "./compareObjects";
function _assertThisInitialized(self) {
    if (self === void 0) {
        throw new ReferenceError(
            "this hasn't been initialised - super() hasn't been called"
        );
    }
    return self;
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
        constructor: {
            value: subClass,
            writable: true,
            configurable: true,
        },
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
}
function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(
                Object.getOwnPropertySymbols(source).filter(function (sym) {
                    return Object.getOwnPropertyDescriptor(
                        source,
                        sym
                    ).enumerable;
                })
            );
        }
        ownKeys.forEach(function (key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}
function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
        return call;
    }
    return _assertThisInitialized(self);
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
var _typeof = function (obj) {
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol
        ? "symbol"
        : typeof obj;
};
var ItemsList = /*#__PURE__*/ (function (Component) {
    "use strict";
    _inherits(ItemsList, Component);
    function ItemsList() {
        _classCallCheck(this, ItemsList);
        var _this;
        _this = _possibleConstructorReturn(
            this,
            _getPrototypeOf(ItemsList).apply(this, arguments)
        );
        _this.storeHighlightedItemReference = function (highlightedItem) {
            _this.props.onHighlightedItemChange(
                highlightedItem === null ? null : highlightedItem.item
            );
        };
        return _this;
    }
    _createClass(ItemsList, [
        {
            key: "shouldComponentUpdate",
            value: function shouldComponentUpdate(nextProps) {
                return compareObjects(nextProps, this.props, ["itemProps"]);
            },
        },
        {
            key: "render",
            value: function render() {
                var _this = this;
                var _props = this.props,
                    items = _props.items,
                    itemProps = _props.itemProps,
                    renderItem = _props.renderItem,
                    renderItemData = _props.renderItemData,
                    sectionIndex = _props.sectionIndex,
                    highlightedItemIndex = _props.highlightedItemIndex,
                    getItemId = _props.getItemId,
                    theme = _props.theme,
                    keyPrefix = _props.keyPrefix;
                var sectionPrefix =
                    sectionIndex === null
                        ? keyPrefix
                        : ""
                              .concat(keyPrefix, "section-")
                              .concat(sectionIndex, "-");
                var isItemPropsFunction = typeof itemProps === "function";
                return /*#__PURE__*/ _jsx(
                    "ul",
                    _objectSpread(
                        {
                            role: "listbox",
                        },
                        theme(
                            "".concat(sectionPrefix, "items-list"),
                            "itemsList"
                        ),
                        {
                            children: items.map(function (item, itemIndex) {
                                var isFirst = itemIndex === 0;
                                var isHighlighted =
                                    itemIndex === highlightedItemIndex;
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
                                    itemPropsObj
                                );
                                if (isHighlighted) {
                                    allItemProps.ref =
                                        _this.storeHighlightedItemReference;
                                }
                                // `key` is provided by theme()
                                /* eslint-disable react/jsx-key */ return /*#__PURE__*/ _jsx(
                                    Item,
                                    _objectSpread({}, allItemProps, {
                                        sectionIndex: sectionIndex,
                                        isHighlighted: isHighlighted,
                                        itemIndex: itemIndex,
                                        item: item,
                                        renderItem: renderItem,
                                        renderItemData: renderItemData,
                                    })
                                );
                                /* eslint-enable react/jsx-key */
                            }),
                        }
                    )
                );
            },
        },
    ]);
    return ItemsList;
})(Component);
ItemsList.propTypes = {
    items: PropTypes.array.isRequired,
    itemProps: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    renderItem: PropTypes.func.isRequired,
    renderItemData: PropTypes.object.isRequired,
    sectionIndex: PropTypes.number,
    highlightedItemIndex: PropTypes.number,
    onHighlightedItemChange: PropTypes.func.isRequired,
    getItemId: PropTypes.func.isRequired,
    theme: PropTypes.func.isRequired,
    keyPrefix: PropTypes.string.isRequired,
};
ItemsList.defaultProps = {
    sectionIndex: null,
};
export { ItemsList as default };
