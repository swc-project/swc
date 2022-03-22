import * as swcHelpers from "@swc/helpers";
import { jsx as _jsx } from "react/jsx-runtime";
import React, { Component } from "react";
import PropTypes from "prop-types";
import Item from "./Item";
import compareObjects from "./compareObjects";
var ItemsList = /*#__PURE__*/ function(Component1) {
    "use strict";
    swcHelpers.inherits(ItemsList, Component1);
    var _super = swcHelpers.createSuper(ItemsList);
    function ItemsList() {
        swcHelpers.classCallCheck(this, ItemsList);
        var _this;
        _this = _super.apply(this, arguments);
        _this.storeHighlightedItemReference = function(highlightedItem) {
            _this.props.onHighlightedItemChange(highlightedItem === null ? null : highlightedItem.item);
        };
        return _this;
    }
    var _proto = ItemsList.prototype;
    _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
        return compareObjects(nextProps, this.props, [
            "itemProps"
        ]);
    };
    _proto.render = function render() {
        var _this = this;
        var _props = this.props, items = _props.items, itemProps = _props.itemProps, renderItem = _props.renderItem, renderItemData = _props.renderItemData, sectionIndex = _props.sectionIndex, highlightedItemIndex = _props.highlightedItemIndex, getItemId = _props.getItemId, theme = _props.theme, keyPrefix = _props.keyPrefix;
        var sectionPrefix = sectionIndex === null ? keyPrefix : "".concat(keyPrefix, "section-").concat(sectionIndex, "-");
        var isItemPropsFunction = typeof itemProps === "function";
        return /*#__PURE__*/ _jsx("ul", swcHelpers.objectSpread({
            role: "listbox"
        }, theme("".concat(sectionPrefix, "items-list"), "itemsList"), {
            children: items.map(function(item, itemIndex) {
                var isFirst = itemIndex === 0;
                var isHighlighted = itemIndex === highlightedItemIndex;
                var itemKey = "".concat(sectionPrefix, "item-").concat(itemIndex);
                var itemPropsObj = isItemPropsFunction ? itemProps({
                    sectionIndex: sectionIndex,
                    itemIndex: itemIndex
                }) : itemProps;
                var allItemProps = swcHelpers.objectSpread({
                    id: getItemId(sectionIndex, itemIndex),
                    "aria-selected": isHighlighted
                }, theme(itemKey, "item", isFirst && "itemFirst", isHighlighted && "itemHighlighted"), itemPropsObj);
                if (isHighlighted) {
                    allItemProps.ref = _this.storeHighlightedItemReference;
                }
                // `key` is provided by theme()
                /* eslint-disable react/jsx-key */ return /*#__PURE__*/ _jsx(Item, swcHelpers.objectSpread({}, allItemProps, {
                    sectionIndex: sectionIndex,
                    isHighlighted: isHighlighted,
                    itemIndex: itemIndex,
                    item: item,
                    renderItem: renderItem,
                    renderItemData: renderItemData
                }));
            /* eslint-enable react/jsx-key */ })
        }));
    };
    return ItemsList;
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
};
ItemsList.defaultProps = {
    sectionIndex: null
};
export { ItemsList as default };
