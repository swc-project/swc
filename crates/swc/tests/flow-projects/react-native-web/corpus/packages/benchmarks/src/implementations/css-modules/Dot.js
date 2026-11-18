import React from 'react';
import styles from './dot-styles.css';

const Dot = ({ size, x, y, children, color }) => (
  <div
    className={styles.root}
    style={{
      borderBottomColor: color,
      borderRightWidth: `${size / 2}px`,
      borderBottomWidth: `${size / 2}px`,
      borderLeftWidth: `${size / 2}px`,
      marginLeft: `${x}px`,
      marginTop: `${y}px`
    }}
  >
    {children}
  </div>
);

export default Dot;
