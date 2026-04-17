import React from 'react';
import { styleq } from 'styleq';

const Dot = ({ size, x, y, children, color }) => {
  const [className, inlineStyle] = styleq([
    styles.root,
    {
      borderBottomColor: color,
      borderRightWidth: size / 2,
      borderBottomWidth: size / 2,
      borderLeftWidth: size / 2,
      marginLeft: x,
      marginTop: y
    }
  ]);

  return <div children={children} className={className} style={inlineStyle} />;
};

const styles = {
  root: {
    $$css: true,
    'css-1co75s2': 'css-1co75s2'
  }
};

export default Dot;
