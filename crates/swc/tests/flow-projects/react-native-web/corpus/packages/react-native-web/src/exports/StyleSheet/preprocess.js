/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import normalizeColor from './compiler/normalizeColor';
import normalizeValueWithProperty from './compiler/normalizeValueWithProperty';
import { warnOnce } from '../../modules/warnOnce';

const emptyObject = {};

/**
 * Shadows
 */

const defaultOffset = { height: 0, width: 0 };

export const createBoxShadowValue = (style: Object): void | string => {
  const { shadowColor, shadowOffset, shadowOpacity, shadowRadius } = style;
  const { height, width } = shadowOffset || defaultOffset;
  const offsetX = normalizeValueWithProperty(width);
  const offsetY = normalizeValueWithProperty(height);
  const blurRadius = normalizeValueWithProperty(shadowRadius || 0);
  const color = normalizeColor(shadowColor || 'black', shadowOpacity);
  if (
    color != null &&
    offsetX != null &&
    offsetY != null &&
    blurRadius != null
  ) {
    return `${offsetX} ${offsetY} ${blurRadius} ${color}`;
  }
};

export const createTextShadowValue = (style: Object): void | string => {
  const { textShadowColor, textShadowOffset, textShadowRadius } = style;
  const { height, width } = textShadowOffset || defaultOffset;
  const radius = textShadowRadius || 0;
  const offsetX = normalizeValueWithProperty(width);
  const offsetY = normalizeValueWithProperty(height);
  const blurRadius = normalizeValueWithProperty(radius);
  const color = normalizeValueWithProperty(textShadowColor, 'textShadowColor');

  if (
    color &&
    (height !== 0 || width !== 0 || radius !== 0) &&
    offsetX != null &&
    offsetY != null &&
    blurRadius != null
  ) {
    return `${offsetX} ${offsetY} ${blurRadius} ${color}`;
  }
};

// { offsetX: 1, offsetY: 2, blurRadius: 3, spreadDistance: 4, color: 'rgba(255, 0, 0)', inset: true }
// => 'rgba(255, 0, 0) 1px 2px 3px 4px inset'
const mapBoxShadow = (boxShadow: Object | string): string => {
  if (typeof boxShadow === 'string') {
    return boxShadow;
  }
  const offsetX = normalizeValueWithProperty(boxShadow.offsetX) || 0;
  const offsetY = normalizeValueWithProperty(boxShadow.offsetY) || 0;
  const blurRadius = normalizeValueWithProperty(boxShadow.blurRadius) || 0;
  const spreadDistance =
    normalizeValueWithProperty(boxShadow.spreadDistance) || 0;
  const color = normalizeColor(boxShadow.color) || 'black';
  const position = boxShadow.inset ? 'inset ' : '';
  return `${position}${offsetX} ${offsetY} ${blurRadius} ${spreadDistance} ${color}`;
};
export const createBoxShadowArrayValue = (value: Array<Object>): string => {
  return value.map(mapBoxShadow).join(', ');
};

// { scale: 2 } => 'scale(2)'
// { translateX: 20 } => 'translateX(20px)'
// { matrix: [1,2,3,4,5,6] } => 'matrix(1,2,3,4,5,6)'
const mapTransform = (transform: Object): string => {
  const type = Object.keys(transform)[0];
  const value = transform[type];
  if (type === 'matrix' || type === 'matrix3d') {
    return `${type}(${value.join(',')})`;
  } else {
    const normalizedValue = normalizeValueWithProperty(value, type);
    return `${type}(${normalizedValue})`;
  }
};
export const createTransformValue = (value: Array<Object>): string => {
  return value.map(mapTransform).join(' ');
};

// [2, '30%', 10] => '2px 30% 10px'
export const createTransformOriginValue = (
  value: Array<number | string>
): string => {
  return value.map((v) => normalizeValueWithProperty(v)).join(' ');
};

const PROPERTIES_STANDARD: { [key: string]: string } = {
  borderBottomEndRadius: 'borderEndEndRadius',
  borderBottomStartRadius: 'borderEndStartRadius',
  borderTopEndRadius: 'borderStartEndRadius',
  borderTopStartRadius: 'borderStartStartRadius',
  borderEndColor: 'borderInlineEndColor',
  borderEndStyle: 'borderInlineEndStyle',
  borderEndWidth: 'borderInlineEndWidth',
  borderStartColor: 'borderInlineStartColor',
  borderStartStyle: 'borderInlineStartStyle',
  borderStartWidth: 'borderInlineStartWidth',
  end: 'insetInlineEnd',
  marginEnd: 'marginInlineEnd',
  marginHorizontal: 'marginInline',
  marginStart: 'marginInlineStart',
  marginVertical: 'marginBlock',
  paddingEnd: 'paddingInlineEnd',
  paddingHorizontal: 'paddingInline',
  paddingStart: 'paddingInlineStart',
  paddingVertical: 'paddingBlock',
  start: 'insetInlineStart'
};

const ignoredProps = {
  elevation: true,
  overlayColor: true,
  resizeMode: true,
  tintColor: true
};

/**
 * Preprocess styles
 */
export const preprocess = <T: {| [key: string]: any |}>(
  originalStyle: T,
  options?: { shadow?: boolean, textShadow?: boolean } = {}
): T => {
  const style = originalStyle || emptyObject;
  const nextStyle = {};

  // Convert shadow styles
  if (
    (options.shadow === true,
    style.shadowColor != null ||
      style.shadowOffset != null ||
      style.shadowOpacity != null ||
      style.shadowRadius != null)
  ) {
    warnOnce(
      'shadowStyles',
      `"shadow*" style props are deprecated. Use "boxShadow".`
    );
    const boxShadowValue = createBoxShadowValue(style);
    if (boxShadowValue != null) {
      nextStyle.boxShadow = boxShadowValue;
    }
  }

  // Convert text shadow styles
  if (
    (options.textShadow === true,
    style.textShadowColor != null ||
      style.textShadowOffset != null ||
      style.textShadowRadius != null)
  ) {
    warnOnce(
      'textShadowStyles',
      `"textShadow*" style props are deprecated. Use "textShadow".`
    );
    const textShadowValue = createTextShadowValue(style);
    if (textShadowValue != null && nextStyle.textShadow == null) {
      const { textShadow } = style;
      const value = textShadow
        ? `${textShadow}, ${textShadowValue}`
        : textShadowValue;
      nextStyle.textShadow = value;
    }
  }

  for (const originalProp in style) {
    if (
      // Ignore some React Native styles
      ignoredProps[originalProp] != null ||
      originalProp === 'shadowColor' ||
      originalProp === 'shadowOffset' ||
      originalProp === 'shadowOpacity' ||
      originalProp === 'shadowRadius' ||
      originalProp === 'textShadowColor' ||
      originalProp === 'textShadowOffset' ||
      originalProp === 'textShadowRadius'
    ) {
      continue;
    }

    const originalValue = style[originalProp];
    const prop = PROPERTIES_STANDARD[originalProp] || originalProp;
    let value = originalValue;

    if (
      !Object.prototype.hasOwnProperty.call(style, originalProp) ||
      (prop !== originalProp && style[prop] != null)
    ) {
      continue;
    }

    if (prop === 'aspectRatio' && typeof value === 'number') {
      nextStyle[prop] = value.toString();
    } else if (prop === 'boxShadow') {
      if (Array.isArray(value)) {
        value = createBoxShadowArrayValue(value);
      }
      const { boxShadow } = nextStyle;
      nextStyle.boxShadow = boxShadow ? `${value}, ${boxShadow}` : value;
    } else if (prop === 'fontVariant') {
      if (Array.isArray(value) && value.length > 0) {
        /*
        warnOnce(
          'fontVariant',
          '"fontVariant" style array value is deprecated. Use space-separated values.'
        );
        */
        value = value.join(' ');
      }
      nextStyle[prop] = value;
    } else if (prop === 'textAlignVertical') {
      /*
      warnOnce(
        'textAlignVertical',
        '"textAlignVertical" style is deprecated. Use "verticalAlign".'
      );
      */
      if (style.verticalAlign == null) {
        nextStyle.verticalAlign = value === 'center' ? 'middle' : value;
      }
    } else if (prop === 'transform') {
      if (Array.isArray(value)) {
        value = createTransformValue(value);
      }
      nextStyle.transform = value;
    } else if (prop === 'transformOrigin') {
      if (Array.isArray(value)) {
        value = createTransformOriginValue(value);
      }
      nextStyle.transformOrigin = value;
    } else {
      nextStyle[prop] = value;
    }
  }

  // $FlowIgnore
  return nextStyle;
};

export default preprocess;
