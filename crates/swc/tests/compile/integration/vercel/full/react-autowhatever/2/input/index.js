import React, { Component } from "react";

export default class ItemsList extends Component {
    static propTypes = {
        items: 500,
    };

    static defaultProps = {
        sectionIndex: null,
    };

    shouldComponentUpdate(nextProps) {
        return compareObjects(nextProps, this.props, ["itemProps"]);
    }

    storeHighlightedItemReference = (highlightedItem) => {
        this.props.onHighlightedItemChange(
            highlightedItem === null ? null : highlightedItem.item
        );
    };

    render() {
        const {
            items,
            itemProps,
            renderItem,
            renderItemData,
            sectionIndex,
            highlightedItemIndex,
            getItemId,
            theme,
            keyPrefix,
        } = this.props;
        const sectionPrefix =
            sectionIndex === null
                ? keyPrefix
                : `${keyPrefix}section-${sectionIndex}-`;
        const isItemPropsFunction = typeof itemProps === "function";

        return (
            <ul
                role="listbox"
                {...theme(`${sectionPrefix}items-list`, "itemsList")}
            >
                {items.map((item, itemIndex) => {
                    const isFirst = itemIndex === 0;
                    const isHighlighted = itemIndex === highlightedItemIndex;
                    const itemKey = `${sectionPrefix}item-${itemIndex}`;
                    const itemPropsObj = isItemPropsFunction
                        ? itemProps({ sectionIndex, itemIndex })
                        : itemProps;
                    const allItemProps = {
                        id: getItemId(sectionIndex, itemIndex),
                        "aria-selected": isHighlighted,
                        ...theme(
                            itemKey,
                            "item",
                            isFirst && "itemFirst",
                            isHighlighted && "itemHighlighted"
                        ),
                        ...itemPropsObj,
                    };

                    if (isHighlighted) {
                        allItemProps.ref = this.storeHighlightedItemReference;
                    }

                    // `key` is provided by theme()
                    /* eslint-disable react/jsx-key */
                    return (
                        <Item
                            {...allItemProps}
                            sectionIndex={sectionIndex}
                            isHighlighted={isHighlighted}
                            itemIndex={itemIndex}
                            item={item}
                            renderItem={renderItem}
                            renderItemData={renderItemData}
                        />
                    );
                    /* eslint-enable react/jsx-key */
                })}
            </ul>
        );
    }
}

const a = new ItemsList();
