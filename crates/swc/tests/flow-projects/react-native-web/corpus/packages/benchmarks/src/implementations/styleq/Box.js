import React from 'react';
import View from './View';

const Box = ({
  color,
  fixed = false,
  layout = 'column',
  outer = false,
  ...other
}) => (
  <View
    {...other}
    style={[
      styles[`color${color}`],
      fixed && styles.fixed,
      layout === 'row' && styles.row,
      outer && styles.outer
    ]}
  />
);

const styles = {
  outer: {
    $$css: true,
    alignSelf: 'r-k200y',
    padding: 'r-tuq35u'
  },
  row: {
    $$css: true,
    flexDirection: 'r-18u37iz'
  },
  color0: {
    $$css: true,
    backgroundColor: 'r-1810x6o'
  },
  color1: {
    $$css: true,
    backgroundColor: 'r-dkge59'
  },
  color2: {
    $$css: true,
    backgroundColor: 'r-18z3xeu'
  },
  color3: {
    $$css: true,
    backgroundColor: 'r-1vkxrha'
  },
  color4: {
    $$css: true,
    backgroundColor: 'r-18z3xeu'
  },
  color5: {
    $$css: true,
    backgroundColor: 'r-e84r5y'
  },
  fixed: {
    $$css: true,
    width: 'r-8hc5te',
    height: 'r-1xbve24'
  }
};

export default Box;
