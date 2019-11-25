/**
* @license
* Copyright Google Inc. All Rights Reserved.
*
* Use of this source code is governed by an MIT-style license that can be
* found in the LICENSE file at https://angular.io/license
*/
import {SafeValue} from '../../sanitization/bypass';
import {StyleSanitizeFn} from '../../sanitization/style_sanitizer';
import {throwErrorIfNoChangesMode} from '../errors';
import {TsickleIssue1009, setInputsForProperty} from '../instructions/shared';
import {AttributeMarker, TAttributes, TNode, TNodeFlags, TNodeType} from '../interfaces/node';
import {RElement} from '../interfaces/renderer';
import {StylingMapArray, StylingMapArrayIndex, TStylingContext} from '../interfaces/styling';
import {isDirectiveHost} from '../interfaces/type_checks';
import {LView, RENDERER, TVIEW} from '../interfaces/view';
import {getActiveDirectiveId, getCheckNoChangesMode, getCurrentStyleSanitizer, getLView, getSelectedIndex, incrementBindingIndex, nextBindingIndex, resetCurrentStyleSanitizer, setCurrentStyleSanitizer, setElementExitFn} from '../state';
import {applyStylingMapDirectly, applyStylingValueDirectly, flushStyling, setClass, setStyle, updateClassViaContext, updateStyleViaContext} from '../styling/bindings';
import {activateStylingMapFeature} from '../styling/map_based_bindings';
import {attachStylingDebugObject} from '../styling/styling_debug';
import {NO_CHANGE} from '../tokens';
import {renderStringify} from '../util/misc_utils';
import {addItemToStylingMap, allocStylingMapArray, allocTStylingContext, allowDirectStyling, concatString, forceClassesAsString, forceStylesAsString, getInitialStylingValue, getStylingMapArray, getValue, hasClassInput, hasStyleInput, hasValueChanged, hasValueChangedUnwrapSafeValue, isHostStylingActive, isStylingContext, isStylingValueDefined, normalizeIntoStylingMap, patchConfig, selectClassBasedInputName, setValue, stylingMapToString} from '../util/styling_utils';
import {getNativeByTNode, getTNode} from '../util/view_utils';



/**
 * --------
 *
 * This file contains the core logic for how styling instructions are processed in Angular.
 *
 * To learn more about the algorithm see `TStylingContext`.
 *
 * --------
 */

/**
 * Sets the current style sanitizer function which will then be used
 * within all follow-up prop and map-based style binding instructions
 * for the given element.
 *
 * Note that once styling has been applied to the element (i.e. once
 * `advance(n)` is executed or the hostBindings/template function exits)
 * then the active `sanitizerFn` will be set to `null`. This means that
 * once styling is applied to another element then a another call to
 * `styleSanitizer` will need to be made.
 *
 * @param sanitizerFn The sanitization function that will be used to
 *       process style prop/value entries.
 *
 * @codeGenApi
 */
export function ɵɵstyleSanitizer(sanitizer: StyleSanitizeFn | null): void {
  setCurrentStyleSanitizer(sanitizer);
}

/**
 * Update a style binding on an element with the provided value.
 *
 * If the style value is falsy then it will be removed from the element
 * (or assigned a different value depending if there are any styles placed
 * on the element with `styleMap` or any static styles that are
 * present from when the element was created with `styling`).
 *
 * Note that the styling element is updated as part of `stylingApply`.
 *
 * @param prop A valid CSS property.
 * @param value New value to write (`null` or an empty string to remove).
 * @param suffix Optional suffix. Used with scalar values to add unit such as `px`.
 *        Note that when a suffix is provided then the underlying sanitizer will
 *        be ignored.
 *
 * Note that this will apply the provided style value to the host element if this function is called
 * within a host binding function.
 *
 * @codeGenApi
 */
export function ɵɵstyleProp(
    prop: string, value: string | number | SafeValue | null,
    suffix?: string | null): TsickleIssue1009 {
  stylePropInternal(getSelectedIndex(), prop, value, suffix);
  return ɵɵstyleProp;
}

/**
 * Internal function for applying a single style to an element.
 *
 * The reason why this function has been separated from `ɵɵstyleProp` is because
 * it is also called from `ɵɵstylePropInterpolate`.
 */
export function stylePropInternal(
    elementIndex: number, prop: string, value: string | number | SafeValue | null,
    suffix?: string | null | undefined): void {
  // if a value is interpolated then it may render a `NO_CHANGE` value.
  // in this case we do not need to do anything, but the binding index
  // still needs to be incremented because all styling binding values
  // are stored inside of the lView.
  const bindingIndex = nextBindingIndex();
  const lView = getLView();
  const tNode = getTNode(elementIndex, lView);
  const firstUpdatePass = lView[TVIEW].firstUpdatePass;

  // we check for this in the instruction code so that the context can be notified
  // about prop or map bindings so that the direct apply check can decide earlier
  // if it allows for context resolution to be bypassed.
  if (firstUpdatePass) {
    patchConfig(tNode, TNodeFlags.hasStylePropBindings);
    patchHostStylingFlag(tNode, isHostStyling(), false);
  }

  const updated = stylingProp(
      tNode, firstUpdatePass, lView, bindingIndex, prop, resolveStylePropValue(value, suffix),
      false);
  if (ngDevMode) {
    ngDevMode.styleProp++;
    if (updated) {
      ngDevMode.stylePropCacheMiss++;
    }
  }
}

/**
 * Update a class binding on an element with the provided value.
 *
 * This instruction is meant to handle the `[class.foo]="exp"` case and,
 * therefore, the class binding itself must already be allocated using
 * `styling` within the creation block.
 *
 * @param prop A valid CSS class (only one).
 * @param value A true/false value which will turn the class on or off.
 *
 * Note that this will apply the provided class value to the host element if this function
 * is called within a host binding function.
 *
 * @codeGenApi
 */
export function ɵɵclassProp(className: string, value: boolean | null): TsickleIssue1009 {
  // if a value is interpolated then it may render a `NO_CHANGE` value.
  // in this case we do not need to do anything, but the binding index
  // still needs to be incremented because all styling binding values
  // are stored inside of the lView.
  const bindingIndex = nextBindingIndex();
  const lView = getLView();
  const elementIndex = getSelectedIndex();
  const tNode = getTNode(elementIndex, lView);
  const firstUpdatePass = lView[TVIEW].firstUpdatePass;

  // we check for this in the instruction code so that the context can be notified
  // about prop or map bindings so that the direct apply check can decide earlier
  // if it allows for context resolution to be bypassed.
  if (firstUpdatePass) {
    patchConfig(tNode, TNodeFlags.hasClassPropBindings);
    patchHostStylingFlag(tNode, isHostStyling(), true);
  }

  const updated = stylingProp(tNode, firstUpdatePass, lView, bindingIndex, className, value, true);
  if (ngDevMode) {
    ngDevMode.classProp++;
    if (updated) {
      ngDevMode.classPropCacheMiss++;
    }
  }
  return ɵɵclassProp;
}

/**
 * Shared function used to update a prop-based styling binding for an element.
 *
 * Depending on the state of the `tNode.styles` styles context, the style/prop
 * value may be applied directly to the element instead of being processed
 * through the context. The reason why this occurs is for performance and fully
 * depends on the state of the context (i.e. whether or not there are duplicate
 * bindings or whether or not there are map-based bindings and property bindings
 * present together).
 */
function stylingProp(
    tNode: TNode, firstUpdatePass: boolean, lView: LView, bindingIndex: number, prop: string,
    value: boolean | number | SafeValue | string | null | undefined | NO_CHANGE,
    isClassBased: boolean): boolean {
  let updated = false;

  const native = getNativeByTNode(tNode, lView) as RElement;
  const context = isClassBased ? getClassesContext(tNode) : getStylesContext(tNode);
  const sanitizer = isClassBased ? null : getCurrentStyleSanitizer();

  // [style.prop] and [class.name] bindings do not use `bind()` and will
  // therefore manage accessing and updating the new value in the lView directly.
  // For this reason, the checkNoChanges situation must also be handled here
  // as well.
  if (ngDevMode && getCheckNoChangesMode()) {
    const oldValue = getValue(lView, bindingIndex);
    if (hasValueChangedUnwrapSafeValue(oldValue, value)) {
      throwErrorIfNoChangesMode(false, oldValue, value);
    }
  }

  // Direct Apply Case: bypass context resolution and apply the
  // style/class value directly to the element
  if (allowDirectStyling(tNode, isClassBased, firstUpdatePass)) {
    const sanitizerToUse = isClassBased ? null : sanitizer;
    const renderer = getRenderer(tNode, lView);
    updated = applyStylingValueDirectly(
        renderer, context, tNode, native, lView, bindingIndex, prop, value, isClassBased,
        sanitizerToUse);

    if (sanitizerToUse) {
      // it's important we remove the current style sanitizer once the
      // element exits, otherwise it will be used by the next styling
      // instructions for the next element.
      setElementExitFn(stylingApply);
    }
  } else {
    // Context Resolution (or first update) Case: save the value
    // and defer to the context to flush and apply the style/class binding
    // value to the element.
    const directiveIndex = getActiveDirectiveId();
    if (isClassBased) {
      updated = updateClassViaContext(
          context, tNode, lView, native, directiveIndex, prop, bindingIndex,
          value as string | boolean | null, false, firstUpdatePass);
    } else {
      updated = updateStyleViaContext(
          context, tNode, lView, native, directiveIndex, prop, bindingIndex,
          value as string | SafeValue | null, sanitizer, false, firstUpdatePass);
    }

    setElementExitFn(stylingApply);
  }

  return updated;
}

/**
 * Update style bindings using an object literal on an element.
 *
 * This instruction is meant to apply styling via the `[style]="exp"` template bindings.
 * When styles are applied to the element they will then be updated with respect to
 * any styles/classes set via `styleProp`. If any styles are set to falsy
 * then they will be removed from the element.
 *
 * Note that the styling instruction will not be applied until `stylingApply` is called.
 *
 * @param styles A key/value style map of the styles that will be applied to the given element.
 *        Any missing styles (that have already been applied to the element beforehand) will be
 *        removed (unset) from the element's styling.
 *
 * Note that this will apply the provided styleMap value to the host element if this function
 * is called within a host binding.
 *
 * @codeGenApi
 */
export function ɵɵstyleMap(styles: {[styleName: string]: any} | NO_CHANGE | null): void {
  const index = getSelectedIndex();
  const lView = getLView();
  const tNode = getTNode(index, lView);
  const firstUpdatePass = lView[TVIEW].firstUpdatePass;
  const context = getStylesContext(tNode);
  const hasDirectiveInput = hasStyleInput(tNode);

  // if a value is interpolated then it may render a `NO_CHANGE` value.
  // in this case we do not need to do anything, but the binding index
  // still needs to be incremented because all styling binding values
  // are stored inside of the lView.
  const bindingIndex = incrementBindingIndex(2);
  const hostBindingsMode = isHostStyling();

  // inputs are only evaluated from a template binding into a directive, therefore,
  // there should not be a situation where a directive host bindings function
  // evaluates the inputs (this should only happen in the template function)
  if (!hostBindingsMode && hasDirectiveInput && styles !== NO_CHANGE) {
    updateDirectiveInputValue(context, lView, tNode, bindingIndex, styles, false, firstUpdatePass);
    styles = NO_CHANGE;
  }

  // we check for this in the instruction code so that the context can be notified
  // about prop or map bindings so that the direct apply check can decide earlier
  // if it allows for context resolution to be bypassed.
  if (firstUpdatePass) {
    patchConfig(tNode, TNodeFlags.hasStyleMapBindings);
    patchHostStylingFlag(tNode, isHostStyling(), false);
  }

  stylingMap(
      context, tNode, firstUpdatePass, lView, bindingIndex, styles, false, hasDirectiveInput);
}

/**
 * Update class bindings using an object literal or class-string on an element.
 *
 * This instruction is meant to apply styling via the `[class]="exp"` template bindings.
 * When classes are applied to the element they will then be updated with
 * respect to any styles/classes set via `classProp`. If any
 * classes are set to falsy then they will be removed from the element.
 *
 * Note that the styling instruction will not be applied until `stylingApply` is called.
 * Note that this will the provided classMap value to the host element if this function is called
 * within a host binding.
 *
 * @param classes A key/value map or string of CSS classes that will be added to the
 *        given element. Any missing classes (that have already been applied to the element
 *        beforehand) will be removed (unset) from the element's list of CSS classes.
 *
 * @codeGenApi
 */
export function ɵɵclassMap(classes: {[className: string]: any} | NO_CHANGE | string | null): void {
  classMapInternal(getSelectedIndex(), classes);
}

/**
 * Internal function for applying a class string or key/value map of classes to an element.
 *
 * The reason why this function has been separated from `ɵɵclassMap` is because
 * it is also called from `ɵɵclassMapInterpolate`.
 */
export function classMapInternal(
    elementIndex: number, classes: {[className: string]: any} | NO_CHANGE | string | null): void {
  const lView = getLView();
  const tNode = getTNode(elementIndex, lView);
  const firstUpdatePass = lView[TVIEW].firstUpdatePass;
  const context = getClassesContext(tNode);
  const hasDirectiveInput = hasClassInput(tNode);

  // if a value is interpolated then it may render a `NO_CHANGE` value.
  // in this case we do not need to do anything, but the binding index
  // still needs to be incremented because all styling binding values
  // are stored inside of the lView.
  const bindingIndex = incrementBindingIndex(2);
  const hostBindingsMode = isHostStyling();

  // inputs are only evaluated from a template binding into a directive, therefore,
  // there should not be a situation where a directive host bindings function
  // evaluates the inputs (this should only happen in the template function)
  if (!hostBindingsMode && hasDirectiveInput && classes !== NO_CHANGE) {
    updateDirectiveInputValue(context, lView, tNode, bindingIndex, classes, true, firstUpdatePass);
    classes = NO_CHANGE;
  }

  // we check for this in the instruction code so that the context can be notified
  // about prop or map bindings so that the direct apply check can decide earlier
  // if it allows for context resolution to be bypassed.
  if (firstUpdatePass) {
    patchConfig(tNode, TNodeFlags.hasClassMapBindings);
    patchHostStylingFlag(tNode, isHostStyling(), true);
  }

  stylingMap(
      context, tNode, firstUpdatePass, lView, bindingIndex, classes, true, hasDirectiveInput);
}

/**
 * Shared function used to update a map-based styling binding for an element.
 *
 * When this function is called it will activate support for `[style]` and
 * `[class]` bindings in Angular.
 */
function stylingMap(
    context: TStylingContext, tNode: TNode, firstUpdatePass: boolean, lView: LView,
    bindingIndex: number, value: {[key: string]: any} | string | null, isClassBased: boolean,
    hasDirectiveInput: boolean): void {
  const directiveIndex = getActiveDirectiveId();
  const native = getNativeByTNode(tNode, lView) as RElement;
  const oldValue = getValue(lView, bindingIndex);
  const sanitizer = getCurrentStyleSanitizer();
  const valueHasChanged = hasValueChanged(oldValue, value);

  // [style] and [class] bindings do not use `bind()` and will therefore
  // manage accessing and updating the new value in the lView directly.
  // For this reason, the checkNoChanges situation must also be handled here
  // as well.
  if (ngDevMode && valueHasChanged && getCheckNoChangesMode()) {
    throwErrorIfNoChangesMode(false, oldValue, value);
  }

  // Direct Apply Case: bypass context resolution and apply the
  // style/class map values directly to the element
  if (allowDirectStyling(tNode, isClassBased, firstUpdatePass)) {
    const sanitizerToUse = isClassBased ? null : sanitizer;
    const renderer = getRenderer(tNode, lView);
    applyStylingMapDirectly(
        renderer, context, tNode, native, lView, bindingIndex, value, isClassBased, sanitizerToUse,
        valueHasChanged, hasDirectiveInput);
    if (sanitizerToUse) {
      // it's important we remove the current style sanitizer once the
      // element exits, otherwise it will be used by the next styling
      // instructions for the next element.
      setElementExitFn(stylingApply);
    }
  } else {
    const stylingMapArr =
        value === NO_CHANGE ? NO_CHANGE : normalizeIntoStylingMap(oldValue, value, !isClassBased);

    activateStylingMapFeature();

    // Context Resolution (or first update) Case: save the map value
    // and defer to the context to flush and apply the style/class binding
    // value to the element.
    if (isClassBased) {
      updateClassViaContext(
          context, tNode, lView, native, directiveIndex, null, bindingIndex, stylingMapArr,
          valueHasChanged, firstUpdatePass);
    } else {
      updateStyleViaContext(
          context, tNode, lView, native, directiveIndex, null, bindingIndex, stylingMapArr,
          sanitizer, valueHasChanged, firstUpdatePass);
    }

    setElementExitFn(stylingApply);
  }

  if (ngDevMode) {
    isClassBased ? ngDevMode.classMap : ngDevMode.styleMap++;
    if (valueHasChanged) {
      isClassBased ? ngDevMode.classMapCacheMiss : ngDevMode.styleMapCacheMiss++;
    }
  }
}

/**
 * Writes a value to a directive's `style` or `class` input binding (if it has changed).
 *
 * If a directive has a `@Input` binding that is set on `style` or `class` then that value
 * will take priority over the underlying style/class styling bindings. This value will
 * be updated for the binding each time during change detection.
 *
 * When this occurs this function will attempt to write the value to the input binding
 * depending on the following situations:
 *
 * - If `oldValue !== newValue`
 * - If `newValue` is `null` (but this is skipped if it is during the first update pass)
 */
function updateDirectiveInputValue(
    context: TStylingContext, lView: LView, tNode: TNode, bindingIndex: number, newValue: any,
    isClassBased: boolean, firstUpdatePass: boolean): void {
  const oldValue = getValue(lView, bindingIndex);
  if (hasValueChanged(oldValue, newValue)) {
    // even if the value has changed we may not want to emit it to the
    // directive input(s) in the event that it is falsy during the
    // first update pass.
    if (isStylingValueDefined(newValue) || !firstUpdatePass) {
      const inputName: string = isClassBased ? selectClassBasedInputName(tNode.inputs !) : 'style';
      const inputs = tNode.inputs ![inputName] !;
      const initialValue = getInitialStylingValue(context);
      const value = normalizeStylingDirectiveInputValue(initialValue, newValue, isClassBased);
      setInputsForProperty(lView, inputs, inputName, value);
      setElementExitFn(stylingApply);
    }
    setValue(lView, bindingIndex, newValue);
  }
}

/**
 * Returns the appropriate directive input value for `style` or `class`.
 *
 * Earlier versions of Angular expect a binding value to be passed into directive code
 * exactly as it is unless there is a static value present (in which case both values
 * will be stringified and concatenated).
 */
function normalizeStylingDirectiveInputValue(
    initialValue: string, bindingValue: string | {[key: string]: any} | null,
    isClassBased: boolean) {
  let value = bindingValue;

  // we only concat values if there is an initial value, otherwise we return the value as is.
  // Note that this is to satisfy backwards-compatibility in Angular.
  if (initialValue.length) {
    if (isClassBased) {
      value = concatString(initialValue, forceClassesAsString(bindingValue));
    } else {
      value = concatString(initialValue, forceStylesAsString(bindingValue, true), ';');
    }
  }
  return value;
}

/**
 * Flushes all styling code to the element.
 *
 * This function is designed to be scheduled from any of the four styling instructions
 * in this file. When called it will flush all style and class bindings to the element
 * via the context resolution algorithm.
 */
function stylingApply(): void {
  const lView = getLView();
  const tView = lView[TVIEW];
  const elementIndex = getSelectedIndex();
  const tNode = getTNode(elementIndex, lView);
  const native = getNativeByTNode(tNode, lView) as RElement;
  const directiveIndex = getActiveDirectiveId();
  const renderer = getRenderer(tNode, lView);
  const sanitizer = getCurrentStyleSanitizer();
  const classesContext = isStylingContext(tNode.classes) ? tNode.classes as TStylingContext : null;
  const stylesContext = isStylingContext(tNode.styles) ? tNode.styles as TStylingContext : null;
  flushStyling(
      renderer, lView, tNode, classesContext, stylesContext, native, directiveIndex, sanitizer,
      tView.firstUpdatePass);
  resetCurrentStyleSanitizer();
}

function getRenderer(tNode: TNode, lView: LView) {
  return tNode.type === TNodeType.Element ? lView[RENDERER] : null;
}

/**
 * Searches and assigns provided all static style/class entries (found in the `attrs` value)
 * and registers them in their respective styling contexts.
 */
export function registerInitialStylingOnTNode(
    tNode: TNode, attrs: TAttributes, startIndex: number): boolean {
  let hasAdditionalInitialStyling = false;
  let styles = getStylingMapArray(tNode.styles);
  let classes = getStylingMapArray(tNode.classes);
  let mode = -1;
  for (let i = startIndex; i < attrs.length; i++) {
    const attr = attrs[i] as string;
    if (typeof attr == 'number') {
      mode = attr;
    } else if (mode == AttributeMarker.Classes) {
      classes = classes || allocStylingMapArray(null);
      addItemToStylingMap(classes, attr, true);
      hasAdditionalInitialStyling = true;
    } else if (mode == AttributeMarker.Styles) {
      const value = attrs[++i] as string | null;
      styles = styles || allocStylingMapArray(null);
      addItemToStylingMap(styles, attr, value);
      hasAdditionalInitialStyling = true;
    }
  }

  if (classes && classes.length > StylingMapArrayIndex.ValuesStartPosition) {
    if (!tNode.classes) {
      tNode.classes = classes;
    }
    updateRawValueOnContext(tNode.classes, stylingMapToString(classes, true));
  }

  if (styles && styles.length > StylingMapArrayIndex.ValuesStartPosition) {
    if (!tNode.styles) {
      tNode.styles = styles;
    }
    updateRawValueOnContext(tNode.styles, stylingMapToString(styles, false));
  }

  if (hasAdditionalInitialStyling) {
    tNode.flags |= TNodeFlags.hasInitialStyling;
  }

  return hasAdditionalInitialStyling;
}

function updateRawValueOnContext(context: TStylingContext | StylingMapArray, value: string) {
  const stylingMapArr = getStylingMapArray(context) !;
  stylingMapArr[StylingMapArrayIndex.RawValuePosition] = value;
}

function getStylesContext(tNode: TNode): TStylingContext {
  return getContext(tNode, false);
}

function getClassesContext(tNode: TNode): TStylingContext {
  return getContext(tNode, true);
}

/**
 * Returns/instantiates a styling context from/to a `tNode` instance.
 */
function getContext(tNode: TNode, isClassBased: boolean): TStylingContext {
  let context = isClassBased ? tNode.classes : tNode.styles;
  if (!isStylingContext(context)) {
    const hasDirectives = isDirectiveHost(tNode);
    context = allocTStylingContext(context as StylingMapArray | null, hasDirectives);
    if (ngDevMode) {
      attachStylingDebugObject(context as TStylingContext, tNode, isClassBased);
    }

    if (isClassBased) {
      tNode.classes = context;
    } else {
      tNode.styles = context;
    }
  }
  return context as TStylingContext;
}

function resolveStylePropValue(
    value: string | number | SafeValue | null | NO_CHANGE,
    suffix: string | null | undefined): string|SafeValue|null|undefined|NO_CHANGE {
  if (value === NO_CHANGE) return value;

  let resolvedValue: string|null = null;
  if (isStylingValueDefined(value)) {
    if (suffix) {
      // when a suffix is applied then it will bypass
      // sanitization entirely (b/c a new string is created)
      resolvedValue = renderStringify(value) + suffix;
    } else {
      // sanitization happens by dealing with a string value
      // this means that the string value will be passed through
      // into the style rendering later (which is where the value
      // will be sanitized before it is applied)
      resolvedValue = value as any as string;
    }
  }
  return resolvedValue;
}

/**
 * Whether or not the style/class binding being applied was executed within a host bindings
 * function.
 */
function isHostStyling(): boolean {
  return isHostStylingActive(getActiveDirectiveId());
}

function patchHostStylingFlag(tNode: TNode, hostBindingsMode: boolean, isClassBased: boolean) {
  const flag = hostBindingsMode ?
      isClassBased ? TNodeFlags.hasHostClassBindings : TNodeFlags.hasHostStyleBindings :
      isClassBased ? TNodeFlags.hasTemplateClassBindings : TNodeFlags.hasTemplateStyleBindings;
  patchConfig(tNode, flag);
}
