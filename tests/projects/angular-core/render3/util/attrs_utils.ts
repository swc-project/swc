/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {AttributeMarker, TAttributes} from '../interfaces/node';
import {CssSelector} from '../interfaces/projection';
import {ProceduralRenderer3, RElement, Renderer3, isProceduralRenderer} from '../interfaces/renderer';


/**
 * Assigns all attribute values to the provided element via the inferred renderer.
 *
 * This function accepts two forms of attribute entries:
 *
 * default: (key, value):
 *  attrs = [key1, value1, key2, value2]
 *
 * namespaced: (NAMESPACE_MARKER, uri, name, value)
 *  attrs = [NAMESPACE_MARKER, uri, name, value, NAMESPACE_MARKER, uri, name, value]
 *
 * The `attrs` array can contain a mix of both the default and namespaced entries.
 * The "default" values are set without a marker, but if the function comes across
 * a marker value then it will attempt to set a namespaced value. If the marker is
 * not of a namespaced value then the function will quit and return the index value
 * where it stopped during the iteration of the attrs array.
 *
 * See [AttributeMarker] to understand what the namespace marker value is.
 *
 * Note that this instruction does not support assigning style and class values to
 * an element. See `elementStart` and `elementHostAttrs` to learn how styling values
 * are applied to an element.
 * @param renderer The renderer to be used
 * @param native The element that the attributes will be assigned to
 * @param attrs The attribute array of values that will be assigned to the element
 * @returns the index value that was last accessed in the attributes array
 */
export function setUpAttributes(renderer: Renderer3, native: RElement, attrs: TAttributes): number {
  const isProc = isProceduralRenderer(renderer);

  let i = 0;
  while (i < attrs.length) {
    const value = attrs[i];
    if (typeof value === 'number') {
      // only namespaces are supported. Other value types (such as style/class
      // entries) are not supported in this function.
      if (value !== AttributeMarker.NamespaceURI) {
        break;
      }

      // we just landed on the marker value ... therefore
      // we should skip to the next entry
      i++;

      const namespaceURI = attrs[i++] as string;
      const attrName = attrs[i++] as string;
      const attrVal = attrs[i++] as string;
      ngDevMode && ngDevMode.rendererSetAttribute++;
      isProc ?
          (renderer as ProceduralRenderer3).setAttribute(native, attrName, attrVal, namespaceURI) :
          native.setAttributeNS(namespaceURI, attrName, attrVal);
    } else {
      // attrName is string;
      const attrName = value as string;
      const attrVal = attrs[++i];
      // Standard attributes
      ngDevMode && ngDevMode.rendererSetAttribute++;
      if (isAnimationProp(attrName)) {
        if (isProc) {
          (renderer as ProceduralRenderer3).setProperty(native, attrName, attrVal);
        }
      } else {
        isProc ?
            (renderer as ProceduralRenderer3).setAttribute(native, attrName, attrVal as string) :
            native.setAttribute(attrName, attrVal as string);
      }
      i++;
    }
  }

  // another piece of code may iterate over the same attributes array. Therefore
  // it may be helpful to return the exact spot where the attributes array exited
  // whether by running into an unsupported marker or if all the static values were
  // iterated over.
  return i;
}

/**
 * Test whether the given value is a marker that indicates that the following
 * attribute values in a `TAttributes` array are only the names of attributes,
 * and not name-value pairs.
 * @param marker The attribute marker to test.
 * @returns true if the marker is a "name-only" marker (e.g. `Bindings`, `Template` or `I18n`).
 */
export function isNameOnlyAttributeMarker(marker: string | AttributeMarker | CssSelector) {
  return marker === AttributeMarker.Bindings || marker === AttributeMarker.Template ||
      marker === AttributeMarker.I18n;
}

export function isAnimationProp(name: string): boolean {
  // Perf note: accessing charCodeAt to check for the first character of a string is faster as
  // compared to accessing a character at index 0 (ex. name[0]). The main reason for this is that
  // charCodeAt doesn't allocate memory to return a substring.
  return name.charCodeAt(0) === 64;  // @
}
