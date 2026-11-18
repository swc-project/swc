/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

'use client';

import type { PlatformMethods } from '../../types';
import type { TextProps } from './types';

import * as React from 'react';
import createElement from '../createElement';
import * as forwardedProps from '../../modules/forwardedProps';
import pick from '../../modules/pick';
import useElementLayout from '../../modules/useElementLayout';
import useMergeRefs from '../../modules/useMergeRefs';
import usePlatformMethods from '../../modules/usePlatformMethods';
import useResponderEvents from '../../modules/useResponderEvents';
import StyleSheet from '../StyleSheet';
import TextAncestorContext from './TextAncestorContext';
import { useLocaleContext, getLocaleDirection } from '../../modules/useLocale';
//import { warnOnce } from '../../modules/warnOnce';

const forwardPropsList = Object.assign(
  {},
  forwardedProps.defaultProps,
  forwardedProps.accessibilityProps,
  forwardedProps.clickProps,
  forwardedProps.focusProps,
  forwardedProps.keyboardProps,
  forwardedProps.mouseProps,
  forwardedProps.touchProps,
  forwardedProps.styleProps,
  {
    href: true,
    lang: true,
    pointerEvents: true
  }
);

const pickProps = (props) => pick(props, forwardPropsList);

const Text: React.AbstractComponent<TextProps, HTMLElement & PlatformMethods> =
  React.forwardRef((props, forwardedRef) => {
    const {
      hrefAttrs,
      numberOfLines,
      onClick,
      onLayout,
      onPress,
      onMoveShouldSetResponder,
      onMoveShouldSetResponderCapture,
      onResponderEnd,
      onResponderGrant,
      onResponderMove,
      onResponderReject,
      onResponderRelease,
      onResponderStart,
      onResponderTerminate,
      onResponderTerminationRequest,
      onScrollShouldSetResponder,
      onScrollShouldSetResponderCapture,
      onSelectionChangeShouldSetResponder,
      onSelectionChangeShouldSetResponderCapture,
      onStartShouldSetResponder,
      onStartShouldSetResponderCapture,
      selectable,
      ...rest
    } = props;

    /*
    if (selectable != null) {
      warnOnce(
        'selectable',
        'selectable prop is deprecated. Use styles.userSelect.'
      );
    }
    */

    const hasTextAncestor = React.useContext(TextAncestorContext);
    const hostRef = React.useRef(null);
    const { direction: contextDirection } = useLocaleContext();

    useElementLayout(hostRef, onLayout);
    useResponderEvents(hostRef, {
      onMoveShouldSetResponder,
      onMoveShouldSetResponderCapture,
      onResponderEnd,
      onResponderGrant,
      onResponderMove,
      onResponderReject,
      onResponderRelease,
      onResponderStart,
      onResponderTerminate,
      onResponderTerminationRequest,
      onScrollShouldSetResponder,
      onScrollShouldSetResponderCapture,
      onSelectionChangeShouldSetResponder,
      onSelectionChangeShouldSetResponderCapture,
      onStartShouldSetResponder,
      onStartShouldSetResponderCapture
    });

    const handleClick = React.useCallback(
      (e) => {
        if (onClick != null) {
          onClick(e);
        } else if (onPress != null) {
          e.stopPropagation();
          onPress(e);
        }
      },
      [onClick, onPress]
    );

    let component = hasTextAncestor ? 'span' : 'div';

    const langDirection =
      props.lang != null ? getLocaleDirection(props.lang) : null;
    const componentDirection = props.dir || langDirection;
    const writingDirection = componentDirection || contextDirection;

    const supportedProps = pickProps(rest);
    supportedProps.dir = componentDirection;
    // 'auto' by default allows browsers to infer writing direction (root elements only)
    if (!hasTextAncestor) {
      supportedProps.dir =
        componentDirection != null ? componentDirection : 'auto';
    }

    if (onClick || onPress) {
      supportedProps.onClick = handleClick;
    }

    supportedProps.style = [
      numberOfLines != null &&
        numberOfLines > 1 && { WebkitLineClamp: numberOfLines },
      hasTextAncestor === true ? styles.textHasAncestor$raw : styles.text$raw,
      numberOfLines === 1 && styles.textOneLine,
      numberOfLines != null && numberOfLines > 1 && styles.textMultiLine,
      props.style,
      selectable === true && styles.selectable,
      selectable === false && styles.notSelectable,
      onPress && styles.pressable
    ];

    if (props.href != null) {
      component = 'a';
      if (hrefAttrs != null) {
        const { download, rel, target } = hrefAttrs;
        if (download != null) {
          supportedProps.download = download;
        }
        if (rel != null) {
          supportedProps.rel = rel;
        }
        if (typeof target === 'string') {
          supportedProps.target =
            target.charAt(0) !== '_' ? '_' + target : target;
        }
      }
    }

    const platformMethodsRef = usePlatformMethods(supportedProps);
    const setRef = useMergeRefs(hostRef, platformMethodsRef, forwardedRef);

    supportedProps.ref = setRef;

    const element = createElement(component, supportedProps, {
      writingDirection
    });

    return hasTextAncestor ? (
      element
    ) : (
      <TextAncestorContext.Provider value={true}>
        {element}
      </TextAncestorContext.Provider>
    );
  });

Text.displayName = 'Text';

const textStyle = {
  backgroundColor: 'transparent',
  border: '0 solid black',
  boxSizing: 'border-box',
  color: 'black',
  display: 'inline',
  font: '14px System',
  listStyle: 'none',
  margin: 0,
  padding: 0,
  position: 'relative',
  textAlign: 'start',
  textDecoration: 'none',
  whiteSpace: 'pre-wrap',
  wordWrap: 'break-word'
};

const styles = StyleSheet.create({
  text$raw: textStyle,
  textHasAncestor$raw: {
    ...textStyle,
    color: 'inherit',
    font: 'inherit',
    textAlign: 'inherit',
    whiteSpace: 'inherit'
  },
  textOneLine: {
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    wordWrap: 'normal'
  },
  // See #13
  textMultiLine: {
    display: '-webkit-box',
    maxWidth: '100%',
    overflow: 'clip',
    textOverflow: 'ellipsis',
    WebkitBoxOrient: 'vertical'
  },
  notSelectable: {
    userSelect: 'none'
  },
  selectable: {
    userSelect: 'text'
  },
  pressable: {
    cursor: 'pointer'
  }
});

export default Text;
