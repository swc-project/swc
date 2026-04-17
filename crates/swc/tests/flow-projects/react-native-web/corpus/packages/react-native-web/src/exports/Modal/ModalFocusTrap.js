/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import * as React from 'react';
import View from '../View';
import createElement from '../createElement';
import StyleSheet from '../StyleSheet';
import UIManager from '../UIManager';
import canUseDOM from '../../modules/canUseDom';

/**
 * This Component is used to "wrap" the modal we're opening
 * so that changing focus via tab will never leave the document.
 *
 * This allows us to properly trap the focus within a modal
 * even if the modal is at the start or end of a document.
 */

const FocusBracket = () => {
  return createElement('div', {
    role: 'none',
    tabIndex: 0,
    style: styles.focusBracket
  });
};

function attemptFocus(element: any) {
  if (!canUseDOM) {
    return false;
  }

  try {
    element.focus();
  } catch (e) {
    // Do nothing
  }

  return document.activeElement === element;
}

function focusFirstDescendant(element: any) {
  for (let i = 0; i < element.childNodes.length; i++) {
    const child = element.childNodes[i];
    if (attemptFocus(child) || focusFirstDescendant(child)) {
      return true;
    }
  }
  return false;
}

function focusLastDescendant(element: any) {
  for (let i = element.childNodes.length - 1; i >= 0; i--) {
    const child = element.childNodes[i];
    if (attemptFocus(child) || focusLastDescendant(child)) {
      return true;
    }
  }
  return false;
}

export type ModalFocusTrapProps = {|
  active?: boolean | (() => boolean),
  children?: any
|};

const ModalFocusTrap = ({
  active,
  children
}: ModalFocusTrapProps): React.Node => {
  const trapElementRef = React.useRef<?HTMLElement>();
  const focusRef = React.useRef<{
    trapFocusInProgress: boolean,
    lastFocusedElement: ?HTMLElement
  }>({
    trapFocusInProgress: false,
    lastFocusedElement: null
  });

  React.useEffect(() => {
    if (canUseDOM) {
      const trapFocus = () => {
        // We should not trap focus if:
        // - The modal hasn't fully initialized with an HTMLElement ref
        // - Focus is already in the process of being trapped (e.g., we're refocusing)
        // - isTrapActive prop being falsey tells us to do nothing
        if (
          trapElementRef.current == null ||
          focusRef.current.trapFocusInProgress ||
          !active
        ) {
          return;
        }

        try {
          focusRef.current.trapFocusInProgress = true;
          if (
            document.activeElement instanceof Node &&
            !trapElementRef.current.contains(document.activeElement)
          ) {
            // To handle keyboard focusing we can make an assumption here.
            // If you're tabbing through the focusable elements, the previously
            // active element will either be the first or the last.
            // If the previously selected element is the "first" descendant
            // and we're leaving it - this means that we should be looping
            // around to the other side of the modal.
            let hasFocused = focusFirstDescendant(trapElementRef.current);
            if (
              focusRef.current.lastFocusedElement === document.activeElement
            ) {
              hasFocused = focusLastDescendant(trapElementRef.current);
            }
            // If we couldn't focus a new element then we need to focus onto the trap target
            if (
              !hasFocused &&
              trapElementRef.current != null &&
              document.activeElement
            ) {
              UIManager.focus(trapElementRef.current);
            }
          }
        } finally {
          focusRef.current.trapFocusInProgress = false;
        }
        focusRef.current.lastFocusedElement = document.activeElement;
      };

      // Call the trapFocus callback at least once when this modal has been activated.
      trapFocus();

      document.addEventListener('focus', trapFocus, true);
      return () => document.removeEventListener('focus', trapFocus, true);
    }
  }, [active]);

  // To be fully compliant with WCAG we need to refocus element that triggered opening modal
  // after closing it
  React.useEffect(function () {
    if (canUseDOM) {
      const lastFocusedElementOutsideTrap = document.activeElement;
      return function () {
        if (
          lastFocusedElementOutsideTrap &&
          document.contains(lastFocusedElementOutsideTrap)
        ) {
          UIManager.focus(lastFocusedElementOutsideTrap);
        }
      };
    }
  }, []);

  return (
    <>
      <FocusBracket />
      <View ref={trapElementRef}>{children}</View>
      <FocusBracket />
    </>
  );
};

export default ModalFocusTrap;

const styles = StyleSheet.create({
  focusBracket: {
    outlineStyle: 'none'
  }
});
