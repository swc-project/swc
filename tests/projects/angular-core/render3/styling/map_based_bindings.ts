/**
* @license
* Copyright Google Inc. All Rights Reserved.
*
* Use of this source code is governed by an MIT-style license that can be
* found in the LICENSE file at https://angular.io/license
*/
import {unwrapSafeValue} from '../../sanitization/bypass';
import {StyleSanitizeFn, StyleSanitizeMode} from '../../sanitization/style_sanitizer';
import {ProceduralRenderer3, RElement, Renderer3} from '../interfaces/renderer';
import {ApplyStylingFn, LStylingData, StylingMapArray, StylingMapArrayIndex, StylingMapsSyncMode, SyncStylingMapsFn, TStylingContext, TStylingContextIndex} from '../interfaces/styling';
import {getBindingValue, getMapProp, getMapValue, getValue, getValuesCount, isStylingValueDefined} from '../util/styling_utils';

import {setStylingMapsSyncFn} from './bindings';


/**
 * --------
 *
 * This file contains the algorithm logic for applying map-based bindings
 * such as `[style]` and `[class]`.
 *
 * --------
 */

/**
 * Enables support for map-based styling bindings (e.g. `[style]` and `[class]` bindings).
 */
export function activateStylingMapFeature() {
  setStylingMapsSyncFn(syncStylingMap);
}

/**
 * Used to apply styling values presently within any map-based bindings on an element.
 *
 * Angular supports map-based styling bindings which can be applied via the
 * `[style]` and `[class]` bindings which can be placed on any HTML element.
 * These bindings can work independently, together or alongside prop-based
 * styling bindings (e.g. `<div [style]="x" [style.width]="w">`).
 *
 * If a map-based styling binding is detected by the compiler, the following
 * AOT code is produced:
 *
 * ```typescript
 * styleMap(ctx.styles); // styles = {key:value}
 * classMap(ctx.classes); // classes = {key:value}|string
 * ```
 *
 * If and when either of the instructions above are evaluated, then the code
 * present in this file is included into the bundle. The mechanism used, to
 * activate support for map-based bindings at runtime is possible via the
 * `activeStylingMapFeature` function (which is also present in this file).
 *
 * # The Algorithm
 * Whenever a map-based binding updates (which is when the identity of the
 * map-value changes) then the map is iterated over and a `StylingMapArray` array
 * is produced. The `StylingMapArray` instance is stored in the binding location
 * where the `BINDING_INDEX` is situated when the `styleMap()` or `classMap()`
 * instruction were called. Once the binding changes, then the internal `bitMask`
 * value is marked as dirty.
 *
 * Styling values are applied once CD exits the element (which happens when
 * the `advance(n)` instruction is called or the template function exits). When
 * this occurs, all prop-based bindings are applied. If a map-based binding is
 * present then a special flushing function (called a sync function) is made
 * available and it will be called each time a styling property is flushed.
 *
 * The flushing algorithm is designed to apply styling for a property (which is
 * a CSS property or a className value) one by one. If map-based bindings
 * are present, then the flushing algorithm will keep calling the maps styling
 * sync function each time a property is visited. This way, the flushing
 * behavior of map-based bindings will always be at the same property level
 * as the current prop-based property being iterated over (because everything
 * is alphabetically sorted).
 *
 * Let's imagine we have the following HTML template code:
 *
 * ```html
 * <div [style]="{width:'100px', height:'200px', 'z-index':'10'}"
 *      [style.width.px]="200">...</div>
 * ```
 *
 * When CD occurs, both the `[style]` and `[style.width]` bindings
 * are evaluated. Then when the styles are flushed on screen, the
 * following operations happen:
 *
 * 1. `[style.width]` is attempted to be written to the element.
 *
 * 2.  Once that happens, the algorithm instructs the map-based
 *     entries (`[style]` in this case) to "catch up" and apply
 *     all values up to the `width` value. When this happens the
 *     `height` value is applied to the element (since it is
 *     alphabetically situated before the `width` property).
 *
 * 3. Since there are no more prop-based entries anymore, the
 *    loop exits and then, just before the flushing ends, it
 *    instructs all map-based bindings to "finish up" applying
 *    their values.
 *
 * 4. The only remaining value within the map-based entries is
 *    the `z-index` value (`width` got skipped because it was
 *    successfully applied via the prop-based `[style.width]`
 *    binding). Since all map-based entries are told to "finish up",
 *    the `z-index` value is iterated over and it is then applied
 *    to the element.
 *
 * The most important thing to take note of here is that prop-based
 * bindings are evaluated in order alongside map-based bindings.
 * This allows all styling across an element to be applied in O(n)
 * time (a similar algorithm is that of the array merge algorithm
 * in merge sort).
 */
export const syncStylingMap: SyncStylingMapsFn =
    (context: TStylingContext, renderer: Renderer3 | ProceduralRenderer3 | null, element: RElement,
     data: LStylingData, sourceIndex: number, applyStylingFn: ApplyStylingFn,
     sanitizer: StyleSanitizeFn | null, mode: StylingMapsSyncMode, targetProp?: string | null,
     defaultValue?: string | boolean | null): boolean => {
      let targetPropValueWasApplied = false;

      // once the map-based styling code is activate it is never deactivated. For this reason a
      // check to see if the current styling context has any map based bindings is required.
      const totalMaps = getValuesCount(context);
      if (totalMaps) {
        let runTheSyncAlgorithm = true;
        const loopUntilEnd = !targetProp;

        // If the code is told to finish up (run until the end), but the mode
        // hasn't been flagged to apply values (it only traverses values) then
        // there is no point in iterating over the array because nothing will
        // be applied to the element.
        if (loopUntilEnd && (mode & StylingMapsSyncMode.ApplyAllValues) === 0) {
          runTheSyncAlgorithm = false;
          targetPropValueWasApplied = true;
        }

        if (runTheSyncAlgorithm) {
          targetPropValueWasApplied = innerSyncStylingMap(
              context, renderer, element, data, applyStylingFn, sanitizer, mode, targetProp || null,
              sourceIndex, defaultValue || null);
        }

        if (loopUntilEnd) {
          resetSyncCursors();
        }
      }

      return targetPropValueWasApplied;
    };

/**
 * Recursive function designed to apply map-based styling to an element one map at a time.
 *
 * This function is designed to be called from the `syncStylingMap` function and will
 * apply map-based styling data one map at a time to the provided `element`.
 *
 * This function is recursive and it will call itself if a follow-up map value is to be
 * processed. To learn more about how the algorithm works, see `syncStylingMap`.
 */
function innerSyncStylingMap(
    context: TStylingContext, renderer: Renderer3 | ProceduralRenderer3 | null, element: RElement,
    data: LStylingData, applyStylingFn: ApplyStylingFn, sanitizer: StyleSanitizeFn | null,
    mode: StylingMapsSyncMode, targetProp: string | null, currentMapIndex: number,
    defaultValue: string | boolean | null): boolean {
  const totalMaps = getValuesCount(context) - 1;  // maps have no default value
  const mapsLimit = totalMaps - 1;
  const recurseInnerMaps =
      currentMapIndex < mapsLimit && (mode & StylingMapsSyncMode.RecurseInnerMaps) !== 0;
  const checkValuesOnly = (mode & StylingMapsSyncMode.CheckValuesOnly) !== 0;

  if (checkValuesOnly) {
    // inner modes do not check values ever (that can only happen
    // when sourceIndex === 0)
    mode &= ~StylingMapsSyncMode.CheckValuesOnly;
  }

  let targetPropValueWasApplied = false;
  if (currentMapIndex <= mapsLimit) {
    let cursor = getCurrentSyncCursor(currentMapIndex);
    const bindingIndex = getBindingValue(
        context, TStylingContextIndex.ValuesStartPosition, currentMapIndex) as number;
    const stylingMapArr = getValue<StylingMapArray>(data, bindingIndex);

    if (stylingMapArr) {
      while (cursor < stylingMapArr.length) {
        const prop = getMapProp(stylingMapArr, cursor);
        const iteratedTooFar = targetProp && prop > targetProp;
        const isTargetPropMatched = !iteratedTooFar && prop === targetProp;
        const value = getMapValue(stylingMapArr, cursor);
        const valueIsDefined = isStylingValueDefined(value);

        // the recursive code is designed to keep applying until
        // it reaches or goes past the target prop. If and when
        // this happens then it will stop processing values, but
        // all other map values must also catch up to the same
        // point. This is why a recursive call is still issued
        // even if the code has iterated too far.
        const innerMode =
            iteratedTooFar ? mode : resolveInnerMapMode(mode, valueIsDefined, isTargetPropMatched);

        const innerProp = iteratedTooFar ? targetProp : prop;
        let valueApplied = recurseInnerMaps ?
            innerSyncStylingMap(
                context, renderer, element, data, applyStylingFn, sanitizer, innerMode, innerProp,
                currentMapIndex + 1, defaultValue) :
            false;

        if (iteratedTooFar) {
          if (!targetPropValueWasApplied) {
            targetPropValueWasApplied = valueApplied;
          }
          break;
        }

        if (!valueApplied && isValueAllowedToBeApplied(mode, isTargetPropMatched)) {
          valueApplied = true;

          if (!checkValuesOnly) {
            const useDefault = isTargetPropMatched && !valueIsDefined;
            const bindingIndexToApply = isTargetPropMatched ? bindingIndex : null;

            let finalValue: any;
            if (useDefault) {
              finalValue = defaultValue;
            } else {
              finalValue = sanitizer ?
                  sanitizer(prop, value, StyleSanitizeMode.ValidateAndSanitize) :
                  (value ? unwrapSafeValue(value) : null);
            }

            applyStylingFn(renderer, element, prop, finalValue, bindingIndexToApply);
          }
        }

        targetPropValueWasApplied = valueApplied && isTargetPropMatched;
        cursor += StylingMapArrayIndex.TupleSize;
      }
      setCurrentSyncCursor(currentMapIndex, cursor);

      // this is a fallback case in the event that the styling map is `null` for this
      // binding but there are other map-based bindings that need to be evaluated
      // afterwards. If the `prop` value is falsy then the intention is to cycle
      // through all of the properties in the remaining maps as well. If the current
      // styling map is too short then there are no values to iterate over. In either
      // case the follow-up maps need to be iterated over.
      if (recurseInnerMaps &&
          (stylingMapArr.length === StylingMapArrayIndex.ValuesStartPosition || !targetProp)) {
        targetPropValueWasApplied = innerSyncStylingMap(
            context, renderer, element, data, applyStylingFn, sanitizer, mode, targetProp,
            currentMapIndex + 1, defaultValue);
      }
    } else if (recurseInnerMaps) {
      targetPropValueWasApplied = innerSyncStylingMap(
          context, renderer, element, data, applyStylingFn, sanitizer, mode, targetProp,
          currentMapIndex + 1, defaultValue);
    }
  }

  return targetPropValueWasApplied;
}

/**
 * Used to determine the mode for the inner recursive call.
 *
 * If an inner map is iterated on then this is done so for one
 * of two reasons:
 *
 * - value is being applied:
 *   if the value is being applied from this current styling
 *   map then there is no need to apply it in a deeper map
 *   (i.e. the `SkipTargetProp` flag is set)
 *
 * - value is being not applied:
 *   apply the value if it is found in a deeper map.
 *   (i.e. the `SkipTargetProp` flag is unset)
 *
 * When these reasons are encountered the flags will for the
 * inner map mode will be configured.
 */
function resolveInnerMapMode(
    currentMode: number, valueIsDefined: boolean, isTargetPropMatched: boolean): number {
  let innerMode = currentMode;

  // the statements below figures out whether or not an inner styling map
  // is allowed to apply its value or not. The main thing to keep note
  // of is that if the target prop isn't matched then its expected that
  // all values before it are allowed to be applied so long as "apply all values"
  // is set to true.
  const applyAllValues = currentMode & StylingMapsSyncMode.ApplyAllValues;
  const applyTargetProp = currentMode & StylingMapsSyncMode.ApplyTargetProp;
  const allowInnerApply =
      !valueIsDefined && (isTargetPropMatched ? applyTargetProp : applyAllValues);

  if (allowInnerApply) {
    // case 1: set the mode to apply the targeted prop value if it
    // ends up being encountered in another map value
    innerMode |= StylingMapsSyncMode.ApplyTargetProp;
    innerMode &= ~StylingMapsSyncMode.SkipTargetProp;
  } else {
    // case 2: set the mode to skip the targeted prop value if it
    // ends up being encountered in another map value
    innerMode |= StylingMapsSyncMode.SkipTargetProp;
    innerMode &= ~StylingMapsSyncMode.ApplyTargetProp;
  }

  return innerMode;
}

/**
 * Decides whether or not a prop/value entry will be applied to an element.
 *
 * To determine whether or not a value is to be applied,
 * the following procedure is evaluated:
 *
 * First check to see the current `mode` status:
 *  1. If the mode value permits all props to be applied then allow.
 *    - But do not allow if the current prop is set to be skipped.
 *  2. Otherwise if the current prop is permitted then allow.
 */
function isValueAllowedToBeApplied(mode: StylingMapsSyncMode, isTargetPropMatched: boolean) {
  let doApplyValue = (mode & StylingMapsSyncMode.ApplyAllValues) !== 0;
  if (!doApplyValue) {
    if (mode & StylingMapsSyncMode.ApplyTargetProp) {
      doApplyValue = isTargetPropMatched;
    }
  } else if ((mode & StylingMapsSyncMode.SkipTargetProp) && isTargetPropMatched) {
    doApplyValue = false;
  }
  return doApplyValue;
}

/**
 * Used to keep track of concurrent cursor values for multiple map-based styling bindings present on
 * an element.
 */
const MAP_CURSORS: number[] = [];

/**
 * Used to reset the state of each cursor value being used to iterate over map-based styling
 * bindings.
 */
function resetSyncCursors() {
  for (let i = 0; i < MAP_CURSORS.length; i++) {
    MAP_CURSORS[i] = StylingMapArrayIndex.ValuesStartPosition;
  }
}

/**
 * Returns an active cursor value at a given mapIndex location.
 */
function getCurrentSyncCursor(mapIndex: number) {
  if (mapIndex >= MAP_CURSORS.length) {
    MAP_CURSORS.push(StylingMapArrayIndex.ValuesStartPosition);
  }
  return MAP_CURSORS[mapIndex];
}

/**
 * Sets a cursor value at a given mapIndex location.
 */
function setCurrentSyncCursor(mapIndex: number, indexValue: number) {
  MAP_CURSORS[mapIndex] = indexValue;
}
