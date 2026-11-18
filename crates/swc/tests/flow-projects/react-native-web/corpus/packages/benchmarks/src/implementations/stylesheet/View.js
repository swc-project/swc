import React from 'react';
import { StyleSheet } from 'react-native-web';

function View(props) {
  const [className, inlineStyle] = StyleSheet([styles.root$raw, props.style]);
  return <div {...props} className={className} style={inlineStyle} />;
}

const styles = StyleSheet.create({
  root$raw: {
    alignItems: 'stretch',
    backgroundColor: 'transparent',
    border: '0 solid black',
    boxSizing: 'border-box',
    display: 'flex',
    flexBasis: 'auto',
    flexDirection: 'column',
    flexShrink: 0,
    listStyle: 'none',
    margin: 0,
    minHeight: 0,
    minWidth: 0,
    padding: 0,
    position: 'relative',
    zIndex: 0
  }
});

export default View;
