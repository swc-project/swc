import { jsx as _jsx } from "react/jsx-runtime";
import React, { Component } from "react";
import PropTypes from "prop-types";
import Item from "./Item";
import compareObjects from "./compareObjects";
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _defineProperty(obj, key, value) {
    return key in obj ? Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : obj[key] = value, obj;
}
function _getPrototypeOf(o) {
    return (_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    })(o);
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = null != arguments[i] ? arguments[i] : {}, ownKeys = Object.keys(source);
        "function" == typeof Object.getOwnPropertySymbols && (ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
            return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }))), ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}
function _setPrototypeOf(o, p) {
    return (_setPrototypeOf = Object.setPrototypeOf || function(o, p) {
        return o.__proto__ = p, o;
    })(o, p);
}
var ItemsList = function(Component) {
    "use strict";
    var Constructor, protoProps, staticProps;
    function ItemsList() {
        var _this, self, call, obj;
        return !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw TypeError("Cannot call a class as a function");
        }(this, ItemsList), _this = (self = this, call = _getPrototypeOf(ItemsList).apply(this, arguments), call && ("object" == ((obj = call) && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj) || "function" == typeof call) ? call : function(self) {
            if (void 0 === self) throw ReferenceError("this hasn't been initialised - super() hasn't been called");
            return self;
        }(self)), _this.storeHighlightedItemReference = function(highlightedItem) {
            _this.props.onHighlightedItemChange(null === highlightedItem ? null : highlightedItem.item);
        }, _this;
    }
    return !function(subClass, superClass) {
        if ("function" != typeof superClass && null !== superClass) throw TypeError("Super expression must either be null or a function");
        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                writable: !0,
                configurable: !0
            }
        }), superClass && _setPrototypeOf(subClass, superClass);
    }(ItemsList, Component), Constructor = ItemsList, protoProps = [
        {
            key: "shouldComponentUpdate",
            value: function(nextProps) {
                return compareObjects(nextProps, this.props, [
                    "itemProps"
                ]);
            }
        },
        {
            key: "render",
            value: function() {
                var _this = this, _props = this.props, items = _props.items, itemProps = _props.itemProps, renderItem = _props.renderItem, renderItemData = _props.renderItemData, sectionIndex = _props.sectionIndex, highlightedItemIndex = _props.highlightedItemIndex, getItemId = _props.getItemId, theme = _props.theme, keyPrefix = _props.keyPrefix, sectionPrefix = null === sectionIndex ? keyPrefix : "".concat(keyPrefix, "section-").concat(sectionIndex, "-"), isItemPropsFunction = "function" == typeof itemProps;
                return _jsx("ul", _objectSpread({
                    role: "listbox"
                }, theme("".concat(sectionPrefix, "items-list"), "itemsList"), {
                    children: items.map(function(item, itemIndex) {
                        var isHighlighted = itemIndex === highlightedItemIndex, itemKey = "".concat(sectionPrefix, "item-").concat(itemIndex), itemPropsObj = isItemPropsFunction ? itemProps({
                            sectionIndex: sectionIndex,
                            itemIndex: itemIndex
                        }) : itemProps, allItemProps = _objectSpread({
                            id: getItemId(sectionIndex, itemIndex),
                            "aria-selected": isHighlighted
                        }, theme(itemKey, "item", 0 === itemIndex && "itemFirst", isHighlighted && "itemHighlighted"), itemPropsObj);
                        return isHighlighted && (allItemProps.ref = _this.storeHighlightedItemReference), _jsx(Item, _objectSpread({}, allItemProps, {
                            sectionIndex: sectionIndex,
                            isHighlighted: isHighlighted,
                            itemIndex: itemIndex,
                            item: item,
                            renderItem: renderItem,
                            renderItemData: renderItemData
                        }));
                    })
                }));
            }
        }, 
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), ItemsList;
}(Component);
ItemsList.propTypes = {
    items: PropTypes.array.isRequired,
    itemProps: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.func
    ]),
    renderItem: PropTypes.func.isRequired,
    renderItemData: PropTypes.object.isRequired,
    sectionIndex: PropTypes.number,
    highlightedItemIndex: PropTypes.number,
    onHighlightedItemChange: PropTypes.func.isRequired,
    getItemId: PropTypes.func.isRequired,
    theme: PropTypes.func.isRequired,
    keyPrefix: PropTypes.string.isRequired
}, ItemsList.defaultProps = {
    sectionIndex: null
};
export { ItemsList as default };
