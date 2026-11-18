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
import type { ViewProps } from './types';

import * as React from 'react';
import createElement from '../createElement';
import * as forwardedProps from '../../modules/forwardedProps';
import pick from '../../modules/pick';
import useElementLayout from '../../modules/useElementLayout';
import useMergeRefs from '../../modules/useMergeRefs';
import usePlatformMethods from '../../modules/usePlatformMethods';
import useResponderEvents from '../../modules/useResponderEvents';
import StyleSheet from '../StyleSheet';
import TextAncestorContext from '../Text/TextAncestorContext';
import { useLocaleContext, getLocaleDirection } from '../../modules/useLocale';

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
    onScroll: true,
    onWheel: true,
    pointerEvents: true
  }
);

const pickProps = (props) => pick(props, forwardPropsList);

const View: React.AbstractComponent<ViewProps, HTMLElement & PlatformMethods> =
  React.forwardRef((props, forwardedRef) => {
    const {
      hrefAttrs,
      onLayout,
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
      ...rest
    } = props;

    if (process.env.NODE_ENV !== 'production') {
      React.Children.toArray(props.children).forEach((item) => {
        if (typeof item === 'string') {
          console.error(
            `Unexpected text node: ${item}. A text node cannot be a child of a <View>.`
          );
        }
      });
    }

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

    let component = 'div';

    const langDirection =
      props.lang != null ? getLocaleDirection(props.lang) : null;
    const componentDirection = props.dir || langDirection;
    const writingDirection = componentDirection || contextDirection;

    const supportedProps = pickProps(rest);
    supportedProps.dir = componentDirection;
    supportedProps.style = [
      styles.view$raw,
      hasTextAncestor && styles.inline,
      props.style
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

    return createElement(component, supportedProps, { writingDirection });
  });

View.displayName = 'View';

const styles = StyleSheet.create({
  view$raw: {
    alignContent: 'flex-start',
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
    textDecoration: 'none',
    zIndex: 0
  },
  inline: {
    display: 'inline-flex'
  }
});

export type { ViewProps };

export default View;
