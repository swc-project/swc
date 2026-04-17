import React from 'react';
import { StyleSheet } from 'react-native-web';

const Dot = ({ size, x, y, children, color }) => {
  const [className, inlineStyle] = StyleSheet([
    styles.root$raw,
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

const styles = StyleSheet.create({
  root$raw: {
    position: 'absolute',
    cursor: 'pointer',
    width: 0,
    height: 0,
    borderColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 0,
    transform: 'translateX(50%) translateY(50%)'
  }
});

export default Dot;
