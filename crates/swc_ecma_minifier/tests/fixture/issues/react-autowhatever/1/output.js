import { jsx as _jsx } from "react/jsx-runtime";
import { Component } from "react";
import PropTypes from "prop-types";
import Item from "./Item";
import compareObjects from "./compareObjects";
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
            var value;
            value = source[key], key in target ? Object.defineProperty(target, key, {
                value: value,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : target[key] = value;
        });
    }
    return target;
}
function _setPrototypeOf(o, p) {
    return (_setPrototypeOf = Object.setPrototypeOf || function(o, p) {
        return o.__proto__ = p, o;
    })(o, p);
}
var ItemsList = /*#__PURE__*/ function(Component) {
    "use strict";
    var protoProps;
    function ItemsList() {
        var _this, call;
        return !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw TypeError("Cannot call a class as a function");
        }(this, ItemsList), call = _getPrototypeOf(ItemsList).apply(this, arguments), (_this = call && ("object" == (call && "undefined" != typeof Symbol && call.constructor === Symbol ? "symbol" : typeof call) || "function" == typeof call) ? call : function(self) {
            if (void 0 === self) throw ReferenceError("this hasn't been initialised - super() hasn't been called");
            return self;
        }(this)).storeHighlightedItemReference = function(highlightedItem) {
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
    }(ItemsList, Component), protoProps = [
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
                return /*#__PURE__*/ _jsx("ul", _objectSpread({
                    role: "listbox"
                }, theme("".concat(sectionPrefix, "items-list"), "itemsList"), {
                    children: items.map(function(item, itemIndex) {
                        var isFirst = 0 === itemIndex, isHighlighted = itemIndex === highlightedItemIndex, itemKey = "".concat(sectionPrefix, "item-").concat(itemIndex), itemPropsObj = isItemPropsFunction ? itemProps({
                            sectionIndex: sectionIndex,
                            itemIndex: itemIndex
                        }) : itemProps, allItemProps = _objectSpread({
                            id: getItemId(sectionIndex, itemIndex),
                            "aria-selected": isHighlighted
                        }, theme(itemKey, "item", isFirst && "itemFirst", isHighlighted && "itemHighlighted"), itemPropsObj);
                        // `key` is provided by theme()
                        /* eslint-disable react/jsx-key */ return isHighlighted && (allItemProps.ref = _this.storeHighlightedItemReference), /*#__PURE__*/ _jsx(Item, _objectSpread({}, allItemProps, {
                            sectionIndex: sectionIndex,
                            isHighlighted: isHighlighted,
                            itemIndex: itemIndex,
                            item: item,
                            renderItem: renderItem,
                            renderItemData: renderItemData
                        }));
                    /* eslint-enable react/jsx-key */ })
                }));
            }
        }
    ], function(target, props) {
        for(var i = 0; i < props.length; i++){
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
    }(ItemsList.prototype, protoProps), ItemsList;
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
