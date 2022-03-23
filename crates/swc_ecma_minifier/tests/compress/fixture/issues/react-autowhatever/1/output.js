import { jsx as _jsx } from "react/jsx-runtime";
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Item from './Item';
import compareObjects from './compareObjects';
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
function _getPrototypeOf(o1) {
    return (_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    })(o1);
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
function _setPrototypeOf(o2, p1) {
    return (_setPrototypeOf = Object.setPrototypeOf || function(o, p) {
        return o.__proto__ = p, o;
    })(o2, p1);
}
var ItemsList = function(Component1) {
    "use strict";
    var Constructor1, protoProps, staticProps;
    function ItemsList1() {
        var _this, self1, call, obj;
        return !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, ItemsList1), _this = (self1 = this, call = _getPrototypeOf(ItemsList1).apply(this, arguments), call && ("object" == ((obj = call) && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj) || "function" == typeof call) ? call : function(self) {
            if (void 0 === self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return self;
        }(self1)), _this.storeHighlightedItemReference = function(highlightedItem) {
            _this.props.onHighlightedItemChange(null === highlightedItem ? null : highlightedItem.item);
        }, _this;
    }
    return !function(subClass, superClass) {
        if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function");
        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                writable: !0,
                configurable: !0
            }
        }), superClass && _setPrototypeOf(subClass, superClass);
    }(ItemsList1, Component1), Constructor1 = ItemsList1, protoProps = [
        {
            key: "shouldComponentUpdate",
            value: function(nextProps) {
                return compareObjects(nextProps, this.props, [
                    'itemProps'
                ]);
            }
        },
        {
            key: "render",
            value: function() {
                var _this = this, _props = this.props, items = _props.items, itemProps = _props.itemProps, renderItem = _props.renderItem, renderItemData = _props.renderItemData, sectionIndex = _props.sectionIndex, highlightedItemIndex = _props.highlightedItemIndex, getItemId = _props.getItemId, theme = _props.theme, keyPrefix = _props.keyPrefix, sectionPrefix = null === sectionIndex ? keyPrefix : "".concat(keyPrefix, "section-").concat(sectionIndex, "-"), isItemPropsFunction = 'function' == typeof itemProps;
                return _jsx("ul", _objectSpread({
                    role: "listbox"
                }, theme("".concat(sectionPrefix, "items-list"), 'itemsList'), {
                    children: items.map(function(item, itemIndex) {
                        var isHighlighted = itemIndex === highlightedItemIndex, itemKey = "".concat(sectionPrefix, "item-").concat(itemIndex), itemPropsObj = isItemPropsFunction ? itemProps({
                            sectionIndex: sectionIndex,
                            itemIndex: itemIndex
                        }) : itemProps, allItemProps = _objectSpread({
                            id: getItemId(sectionIndex, itemIndex),
                            'aria-selected': isHighlighted
                        }, theme(itemKey, 'item', 0 === itemIndex && 'itemFirst', isHighlighted && 'itemHighlighted'), itemPropsObj);
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
        }
    ], _defineProperties(Constructor1.prototype, protoProps), staticProps && _defineProperties(Constructor1, staticProps), ItemsList1;
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
