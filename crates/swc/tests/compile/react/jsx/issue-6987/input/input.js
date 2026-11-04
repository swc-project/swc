import { isValidElement, Children } from "react";

import * as styles from "./CheckmarkList.styles";


const CheckmarkList = ({ children}) => {
  const listItems = () =>
    Children.map(children, (child, index) => {
      if (!isValidElement(child)) {
        return null;
      }
      const { children: liChildren, css: liCss, ...otherProps } = child.props;

      return (
        <li {...otherProps} key={`checkmark-list-item-${index}`} css={[styles.listItem, liCss]}>
          {liChildren}
        </li>
      );
    });

  return <ul css={styles.list}>{listItems()}</ul>;
};

export { CheckmarkList };
