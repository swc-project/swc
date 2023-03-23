import { jsx as _jsx } from "@emotion/react/jsx-runtime";
import { createElement as _createElement } from "@emotion/react";
import { isValidElement, Children } from "react";
import * as styles from "./CheckmarkList.styles";
const CheckmarkList = ({ children  })=>{
    const listItems = ()=>Children.map(children, (child, index)=>{
            if (!/*#__PURE__*/ isValidElement(child)) {
                return null;
            }
            const { children: liChildren , css: liCss , ...otherProps } = child.props;
            return /*#__PURE__*/ _createElement("li", {
                ...otherProps,
                key: `checkmark-list-item-${index}`,
                css: [
                    styles.listItem,
                    liCss
                ]
            }, liChildren);
        });
    return /*#__PURE__*/ _jsx("ul", {
        css: styles.list,
        children: listItems()
    });
};
export { CheckmarkList };
