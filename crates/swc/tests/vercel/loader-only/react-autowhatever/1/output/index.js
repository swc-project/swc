import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
import { jsx as _jsx } from "react/jsx-runtime";
import React, { Component } from "react";
import PropTypes from "prop-types";
import Item from "./Item";
import compareObjects from "./compareObjects";
var ItemsList = /*#__PURE__*/ function(Component) {
    "use strict";
    _inherits(ItemsList, Component);
    function ItemsList() {
        _class_call_check(this, ItemsList);
        var _this;
        _this = _call_super(this, ItemsList, arguments), _define_property(_this, "storeHighlightedItemReference", function(highlightedItem) {
            _this.props.onHighlightedItemChange(highlightedItem === null ? null : highlightedItem.item);
        });
        return _this;
    }
    _create_class(ItemsList, [
        {
            key: "shouldComponentUpdate",
            value: function shouldComponentUpdate(nextProps) {
                return compareObjects(nextProps, this.props, [
                    "itemProps"
                ]);
            }
        },
        {
            key: "render",
            value: function render() {
                var _this = this;
                var _this_props = this.props, items = _this_props.items, itemProps = _this_props.itemProps, renderItem = _this_props.renderItem, renderItemData = _this_props.renderItemData, sectionIndex = _this_props.sectionIndex, highlightedItemIndex = _this_props.highlightedItemIndex, getItemId = _this_props.getItemId, theme = _this_props.theme, keyPrefix = _this_props.keyPrefix;
                var sectionPrefix = sectionIndex === null ? keyPrefix : "".concat(keyPrefix, "section-").concat(sectionIndex, "-");
                var isItemPropsFunction = typeof itemProps === "function";
                return /*#__PURE__*/ _jsx("ul", _object_spread_props(_object_spread({
                    role: "listbox"
                }, theme("".concat(sectionPrefix, "items-list"), "itemsList")), {
                    children: items.map(function(item, itemIndex) {
                        var isFirst = itemIndex === 0;
                        var isHighlighted = itemIndex === highlightedItemIndex;
                        var itemKey = "".concat(sectionPrefix, "item-").concat(itemIndex);
                        var itemPropsObj = isItemPropsFunction ? itemProps({
                            sectionIndex: sectionIndex,
                            itemIndex: itemIndex
                        }) : itemProps;
                        var allItemProps = _object_spread({
                            id: getItemId(sectionIndex, itemIndex),
                            "aria-selected": isHighlighted
                        }, theme(itemKey, "item", isFirst && "itemFirst", isHighlighted && "itemHighlighted"), itemPropsObj);
                        if (isHighlighted) {
                            allItemProps.ref = _this.storeHighlightedItemReference;
                        }
                        // `key` is provided by theme()
                        /* eslint-disable react/jsx-key */ return /*#__PURE__*/ _jsx(Item, _object_spread_props(_object_spread({}, allItemProps), {
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
    ]);
    return ItemsList;
}(Component);
_define_property(ItemsList, "propTypes", {
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
});
_define_property(ItemsList, "defaultProps", {
    sectionIndex: null
});
export { ItemsList as default };
