/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 */

import createReactDOMStyle from './createReactDOMStyle';
import hash from './hash';
import hyphenateStyleName from './hyphenateStyleName';
import normalizeValueWithProperty from './normalizeValueWithProperty';
import prefixStyles from '../../../modules/prefixStyles';

type Value = Object | Array<any> | string | number;
type Style = { [key: string]: Value };
type Rule = string;
type Rules = Array<Rule>;
type RulesData = [Rules, number];
type CompiledStyle = {
  $$css: boolean,
  $$css$localize?: boolean,
  [key: string]: string | Array<string>
};
type CompilerOutput = [CompiledStyle, Array<RulesData>];

const cache = new Map();
const emptyObject = {};

const classicGroup = 1;
const atomicGroup = 3;
const customGroup: { [key: string]: number } = {
  borderColor: 2,
  borderRadius: 2,
  borderStyle: 2,
  borderWidth: 2,
  display: 2,
  flex: 2,
  inset: 2,
  margin: 2,
  overflow: 2,
  overscrollBehavior: 2,
  padding: 2,
  insetBlock: 2.1,
  insetInline: 2.1,
  marginInline: 2.1,
  marginBlock: 2.1,
  paddingInline: 2.1,
  paddingBlock: 2.1,
  borderBlockStartColor: 2.2,
  borderBlockStartStyle: 2.2,
  borderBlockStartWidth: 2.2,
  borderBlockEndColor: 2.2,
  borderBlockEndStyle: 2.2,
  borderBlockEndWidth: 2.2,
  borderInlineStartColor: 2.2,
  borderInlineStartStyle: 2.2,
  borderInlineStartWidth: 2.2,
  borderInlineEndColor: 2.2,
  borderInlineEndStyle: 2.2,
  borderInlineEndWidth: 2.2,
  borderEndStartRadius: 2.2,
  borderEndEndRadius: 2.2,
  borderStartStartRadius: 2.2,
  borderStartEndRadius: 2.2,
  insetBlockEnd: 2.2,
  insetBlockStart: 2.2,
  insetInlineEnd: 2.2,
  insetInlineStart: 2.2,
  marginBlockStart: 2.2,
  marginBlockEnd: 2.2,
  marginInlineStart: 2.2,
  marginInlineEnd: 2.2,
  paddingBlockStart: 2.2,
  paddingBlockEnd: 2.2,
  paddingInlineStart: 2.2,
  paddingInlineEnd: 2.2
};

const borderTopLeftRadius = 'borderTopLeftRadius';
const borderTopRightRadius = 'borderTopRightRadius';
const borderBottomLeftRadius = 'borderBottomLeftRadius';
const borderBottomRightRadius = 'borderBottomRightRadius';
const borderLeftColor = 'borderLeftColor';
const borderLeftStyle = 'borderLeftStyle';
const borderLeftWidth = 'borderLeftWidth';
const borderRightColor = 'borderRightColor';
const borderRightStyle = 'borderRightStyle';
const borderRightWidth = 'borderRightWidth';
const right = 'right';
const marginLeft = 'marginLeft';
const marginRight = 'marginRight';
const paddingLeft = 'paddingLeft';
const paddingRight = 'paddingRight';
const left = 'left';

// Map of LTR property names to their BiDi equivalent.
const PROPERTIES_FLIP: { [key: string]: string } = {
  [borderTopLeftRadius]: borderTopRightRadius,
  [borderTopRightRadius]: borderTopLeftRadius,
  [borderBottomLeftRadius]: borderBottomRightRadius,
  [borderBottomRightRadius]: borderBottomLeftRadius,
  [borderLeftColor]: borderRightColor,
  [borderLeftStyle]: borderRightStyle,
  [borderLeftWidth]: borderRightWidth,
  [borderRightColor]: borderLeftColor,
  [borderRightStyle]: borderLeftStyle,
  [borderRightWidth]: borderLeftWidth,
  [left]: right,
  [marginLeft]: marginRight,
  [marginRight]: marginLeft,
  [paddingLeft]: paddingRight,
  [paddingRight]: paddingLeft,
  [right]: left
};

// Map of I18N property names to their LTR equivalent.
const PROPERTIES_I18N: { [key: string]: string } = {
  borderStartStartRadius: borderTopLeftRadius,
  borderStartEndRadius: borderTopRightRadius,
  borderEndStartRadius: borderBottomLeftRadius,
  borderEndEndRadius: borderBottomRightRadius,
  borderInlineStartColor: borderLeftColor,
  borderInlineStartStyle: borderLeftStyle,
  borderInlineStartWidth: borderLeftWidth,
  borderInlineEndColor: borderRightColor,
  borderInlineEndStyle: borderRightStyle,
  borderInlineEndWidth: borderRightWidth,
  insetInlineEnd: right,
  insetInlineStart: left,
  marginInlineStart: marginLeft,
  marginInlineEnd: marginRight,
  paddingInlineStart: paddingLeft,
  paddingInlineEnd: paddingRight
};

const PROPERTIES_VALUE = ['clear', 'float', 'textAlign'];

export function atomic(style: Style): CompilerOutput {
  const compiledStyle: CompiledStyle = { $$css: true };
  const compiledRules = [];

  function atomicCompile(srcProp, prop, value) {
    const valueString = stringifyValueWithProperty(value, prop);
    const cacheKey = prop + valueString;
    const cachedResult = cache.get(cacheKey);
    let identifier;
    if (cachedResult != null) {
      identifier = cachedResult[0];
      compiledRules.push(cachedResult[1]);
    } else {
      const v = srcProp !== prop ? cacheKey : valueString;
      identifier = createIdentifier('r', srcProp, v);
      const order = customGroup[srcProp] || atomicGroup;
      const rules = createAtomicRules(identifier, prop, value);
      const orderedRules = [rules, order];
      compiledRules.push(orderedRules);
      cache.set(cacheKey, [identifier, orderedRules]);
    }
    return identifier;
  }

  Object.keys(style)
    .sort()
    .forEach((srcProp) => {
      const value = style[srcProp];
      if (value != null) {
        let localizeableValue;
        // BiDi flip values
        if (PROPERTIES_VALUE.indexOf(srcProp) > -1) {
          const left = atomicCompile(srcProp, srcProp, 'left');
          const right = atomicCompile(srcProp, srcProp, 'right');
          if (value === 'start') {
            localizeableValue = [left, right];
          } else if (value === 'end') {
            localizeableValue = [right, left];
          }
        }
        // BiDi flip properties
        const propPolyfill = PROPERTIES_I18N[srcProp];
        if (propPolyfill != null) {
          const ltr = atomicCompile(srcProp, propPolyfill, value);
          const rtl = atomicCompile(
            srcProp,
            PROPERTIES_FLIP[propPolyfill],
            value
          );
          localizeableValue = [ltr, rtl];
        }
        // BiDi flip transitionProperty value
        if (srcProp === 'transitionProperty') {
          const values = Array.isArray(value) ? value : [value];
          const polyfillIndices = [];

          for (let i = 0; i < values.length; i++) {
            const val = values[i];
            if (typeof val === 'string' && PROPERTIES_I18N[val] != null) {
              polyfillIndices.push(i);
            }
          }

          if (polyfillIndices.length > 0) {
            const ltrPolyfillValues = [...values];
            const rtlPolyfillValues = [...values];
            polyfillIndices.forEach((i) => {
              const ltrVal = ltrPolyfillValues[i];
              if (typeof ltrVal === 'string') {
                const ltrPolyfill = PROPERTIES_I18N[ltrVal];
                const rtlPolyfill = PROPERTIES_FLIP[ltrPolyfill];
                ltrPolyfillValues[i] = ltrPolyfill;
                rtlPolyfillValues[i] = rtlPolyfill;
                const ltr = atomicCompile(srcProp, srcProp, ltrPolyfillValues);
                const rtl = atomicCompile(srcProp, srcProp, rtlPolyfillValues);
                localizeableValue = [ltr, rtl];
              }
            });
          }
        }

        if (localizeableValue == null) {
          localizeableValue = atomicCompile(srcProp, srcProp, value);
        } else {
          compiledStyle['$$css$localize'] = true;
        }

        compiledStyle[srcProp] = localizeableValue;
      }
    });

  return [compiledStyle, compiledRules];
}

/**
 * Compile simple style object to classic CSS rules.
 * No support for 'placeholderTextColor', 'scrollbarWidth', or 'pointerEvents'.
 */
export function classic(style: Style, name: string): CompilerOutput {
  const compiledStyle = { $$css: true };
  const compiledRules = [];

  const { animationKeyframes, ...rest } = style;
  const identifier = createIdentifier('css', name, JSON.stringify(style));
  const selector = `.${identifier}`;
  let animationName;
  if (animationKeyframes != null) {
    const [animationNames, keyframesRules] =
      processKeyframesValue(animationKeyframes);
    animationName = animationNames.join(',');
    compiledRules.push(...keyframesRules);
  }
  const block = createDeclarationBlock({ ...rest, animationName });
  compiledRules.push(`${selector}${block}`);

  compiledStyle[identifier] = identifier;
  return [compiledStyle, [[compiledRules, classicGroup]]];
}

/**
 * Compile simple style object to inline DOM styles.
 * No support for 'animationKeyframes', 'placeholderTextColor', 'scrollbarWidth', or 'pointerEvents'.
 */
export function inline(
  originalStyle: Style,
  isRTL?: boolean
): { [key: string]: mixed } {
  const style = originalStyle || emptyObject;
  const frozenProps = {};
  const nextStyle = {};

  for (const originalProp in style) {
    const originalValue = style[originalProp];
    let prop = originalProp;
    let value = originalValue;

    if (
      !Object.prototype.hasOwnProperty.call(style, originalProp) ||
      originalValue == null
    ) {
      continue;
    }

    // BiDi flip values
    if (PROPERTIES_VALUE.indexOf(originalProp) > -1) {
      if (originalValue === 'start') {
        value = isRTL ? 'right' : 'left';
      } else if (originalValue === 'end') {
        value = isRTL ? 'left' : 'right';
      }
    }
    // BiDi flip properties
    const propPolyfill = PROPERTIES_I18N[originalProp];
    if (propPolyfill != null) {
      prop = isRTL ? PROPERTIES_FLIP[propPolyfill] : propPolyfill;
    }
    // BiDi flip transitionProperty value
    if (originalProp === 'transitionProperty') {
      // $FlowFixMe
      const originalValues = Array.isArray(originalValue)
        ? originalValue
        : [originalValue];
      originalValues.forEach((val, i) => {
        if (typeof val === 'string') {
          const valuePolyfill = PROPERTIES_I18N[val];
          if (valuePolyfill != null) {
            originalValues[i] = isRTL
              ? PROPERTIES_FLIP[valuePolyfill]
              : valuePolyfill;

            value = originalValues.join(' ');
          }
        }
      });
    }

    // Create finalized style
    if (!frozenProps[prop]) {
      nextStyle[prop] = value;
    }

    if (prop === originalProp) {
      frozenProps[prop] = true;
    }

    //    if (PROPERTIES_I18N.hasOwnProperty(originalProp)) {
    //    frozenProps[prop] = true;
    //}
  }

  return createReactDOMStyle(nextStyle, true);
}

/**
 * Create a value string that normalizes different input values with a common
 * output.
 */
export function stringifyValueWithProperty(
  value: Value,
  property: ?string
): string {
  // e.g., 0 => '0px', 'black' => 'rgba(0,0,0,1)'
  const normalizedValue = normalizeValueWithProperty(value, property);
  return typeof normalizedValue !== 'string'
    ? JSON.stringify(normalizedValue || '')
    : normalizedValue;
}

/**
 * Create the Atomic CSS rules needed for a given StyleSheet rule.
 * Translates StyleSheet declarations to CSS.
 */
function createAtomicRules(identifier: string, property, value): Rules {
  const rules = [];
  const selector = `.${identifier}`;

  // Handle non-standard properties and object values that require multiple
  // CSS rules to be created.
  switch (property) {
    case 'animationKeyframes': {
      const [animationNames, keyframesRules] = processKeyframesValue(value);
      const block = createDeclarationBlock({
        animationName: animationNames.join(',')
      });
      rules.push(`${selector}${block}`, ...keyframesRules);
      break;
    }

    // Equivalent to using '::placeholder'
    case 'placeholderTextColor': {
      const block = createDeclarationBlock({ color: value, opacity: 1 });
      rules.push(
        `${selector}::-webkit-input-placeholder${block}`,
        `${selector}::-moz-placeholder${block}`,
        `${selector}:-ms-input-placeholder${block}`,
        `${selector}::placeholder${block}`
      );
      break;
    }

    // Polyfill for additional 'pointer-events' values
    // See d13f78622b233a0afc0c7a200c0a0792c8ca9e58
    // See https://reactnative.dev/docs/view#pointerevents
    case 'pointerEvents': {
      let finalValue = value;
      if (value === 'auto') {
        finalValue = 'auto!important';
      } else if (value === 'none') {
        finalValue = 'none!important';
        const block = createDeclarationBlock({ pointerEvents: 'none' });
        rules.push(`${selector}>* ${block}`);
      } else if (value === 'box-none') {
        finalValue = 'none!important';
        const block = createDeclarationBlock({ pointerEvents: 'auto' });
        rules.push(`${selector}>* ${block}`);
      } else if (value === 'box-only') {
        finalValue = 'auto!important';
        const block = createDeclarationBlock({ pointerEvents: 'none' });
        rules.push(`${selector}>* ${block}`);
      }
      const block = createDeclarationBlock({ pointerEvents: finalValue });
      rules.push(`${selector}${block}`);
      break;
    }

    // Polyfill for draft spec
    // https://drafts.csswg.org/css-scrollbars-1/
    case 'scrollbarWidth': {
      if (value === 'none') {
        rules.push(`${selector}::-webkit-scrollbar{display:none}`);
      }
      const block = createDeclarationBlock({ scrollbarWidth: value });
      rules.push(`${selector}${block}`);
      break;
    }

    default: {
      const block = createDeclarationBlock({ [property]: value });
      rules.push(`${selector}${block}`);
      break;
    }
  }

  return rules;
}

/**
 * Creates a CSS declaration block from a StyleSheet object.
 */
function createDeclarationBlock(style: Style): string {
  const domStyle = prefixStyles(createReactDOMStyle(style));
  const declarationsString = Object.keys(domStyle)
    .map((property) => {
      const value = domStyle[property];
      const prop = hyphenateStyleName(property);
      // The prefixer may return an array of values:
      // { display: [ '-webkit-flex', 'flex' ] }
      // to represent "fallback" declarations
      // { display: -webkit-flex; display: flex; }
      if (Array.isArray(value)) {
        return value.map((v) => `${prop}:${v}`).join(';');
      } else {
        return `${prop}:${value}`;
      }
    })
    // Once properties are hyphenated, this will put the vendor
    // prefixed and short-form properties first in the list.
    .sort()
    .join(';');

  return `{${declarationsString};}`;
}

/**
 * An identifier is associated with a unique set of styles.
 */
function createIdentifier(prefix: string, name: string, key: string): string {
  const hashedString = hash(name + key);
  return process.env.NODE_ENV !== 'production'
    ? `${prefix}-${name}-${hashedString}`
    : `${prefix}-${hashedString}`;
}

/**
 * Create individual CSS keyframes rules.
 */
function createKeyframes(keyframes: Object): [string, Rules] {
  const prefixes = ['-webkit-', ''];
  const identifier = createIdentifier(
    'r',
    'animation',
    JSON.stringify(keyframes)
  );

  const steps =
    '{' +
    Object.keys(keyframes)
      .map((stepName) => {
        const rule = keyframes[stepName];
        const block = createDeclarationBlock(rule);
        return `${stepName}${block}`;
      })
      .join('') +
    '}';

  const rules = prefixes.map((prefix) => {
    return `@${prefix}keyframes ${identifier}${steps}`;
  });
  return [identifier, rules];
}

/**
 * Create CSS keyframes rules and names from a StyleSheet keyframes object.
 */
function processKeyframesValue(keyframesValue) {
  if (typeof keyframesValue === 'number') {
    throw new Error(`Invalid CSS keyframes type: ${typeof keyframesValue}`);
  }

  const animationNames = [];
  const rules = [];
  const value = Array.isArray(keyframesValue)
    ? keyframesValue
    : [keyframesValue];

  value.forEach((keyframes) => {
    if (typeof keyframes === 'string') {
      // Support external animation libraries (identifiers only)
      animationNames.push(keyframes);
    } else {
      // Create rules for each of the keyframes
      const [identifier, keyframesRules] = createKeyframes(keyframes);
      animationNames.push(identifier);
      rules.push(...keyframesRules);
    }
  });

  return [animationNames, rules];
}
