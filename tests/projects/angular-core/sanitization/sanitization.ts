/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {getDocument} from '../render3/interfaces/document';
import {SANITIZER} from '../render3/interfaces/view';
import {getLView} from '../render3/state';
import {renderStringify} from '../render3/util/misc_utils';

import {BypassType, allowSanitizationBypassAndThrow, unwrapSafeValue} from './bypass';
import {_sanitizeHtml as _sanitizeHtml} from './html_sanitizer';
import {Sanitizer} from './sanitizer';
import {SecurityContext} from './security';
import {StyleSanitizeFn, StyleSanitizeMode, _sanitizeStyle as _sanitizeStyle} from './style_sanitizer';
import {_sanitizeUrl as _sanitizeUrl} from './url_sanitizer';



/**
 * An `html` sanitizer which converts untrusted `html` **string** into trusted string by removing
 * dangerous content.
 *
 * This method parses the `html` and locates potentially dangerous content (such as urls and
 * javascript) and removes it.
 *
 * It is possible to mark a string as trusted by calling {@link bypassSanitizationTrustHtml}.
 *
 * @param unsafeHtml untrusted `html`, typically from the user.
 * @returns `html` string which is safe to display to user, because all of the dangerous javascript
 * and urls have been removed.
 *
 * @publicApi
 */
export function ɵɵsanitizeHtml(unsafeHtml: any): string {
  const sanitizer = getSanitizer();
  if (sanitizer) {
    return sanitizer.sanitize(SecurityContext.HTML, unsafeHtml) || '';
  }
  if (allowSanitizationBypassAndThrow(unsafeHtml, BypassType.Html)) {
    return unwrapSafeValue(unsafeHtml);
  }
  return _sanitizeHtml(getDocument(), renderStringify(unsafeHtml));
}

/**
 * A `style` sanitizer which converts untrusted `style` **string** into trusted string by removing
 * dangerous content.
 *
 * This method parses the `style` and locates potentially dangerous content (such as urls and
 * javascript) and removes it.
 *
 * It is possible to mark a string as trusted by calling {@link bypassSanitizationTrustStyle}.
 *
 * @param unsafeStyle untrusted `style`, typically from the user.
 * @returns `style` string which is safe to bind to the `style` properties, because all of the
 * dangerous javascript and urls have been removed.
 *
 * @publicApi
 */
export function ɵɵsanitizeStyle(unsafeStyle: any): string {
  const sanitizer = getSanitizer();
  if (sanitizer) {
    return sanitizer.sanitize(SecurityContext.STYLE, unsafeStyle) || '';
  }
  if (allowSanitizationBypassAndThrow(unsafeStyle, BypassType.Style)) {
    return unwrapSafeValue(unsafeStyle);
  }
  return _sanitizeStyle(renderStringify(unsafeStyle));
}

/**
 * A `url` sanitizer which converts untrusted `url` **string** into trusted string by removing
 * dangerous
 * content.
 *
 * This method parses the `url` and locates potentially dangerous content (such as javascript) and
 * removes it.
 *
 * It is possible to mark a string as trusted by calling {@link bypassSanitizationTrustUrl}.
 *
 * @param unsafeUrl untrusted `url`, typically from the user.
 * @returns `url` string which is safe to bind to the `src` properties such as `<img src>`, because
 * all of the dangerous javascript has been removed.
 *
 * @publicApi
 */
export function ɵɵsanitizeUrl(unsafeUrl: any): string {
  const sanitizer = getSanitizer();
  if (sanitizer) {
    return sanitizer.sanitize(SecurityContext.URL, unsafeUrl) || '';
  }
  if (allowSanitizationBypassAndThrow(unsafeUrl, BypassType.Url)) {
    return unwrapSafeValue(unsafeUrl);
  }
  return _sanitizeUrl(renderStringify(unsafeUrl));
}

/**
 * A `url` sanitizer which only lets trusted `url`s through.
 *
 * This passes only `url`s marked trusted by calling {@link bypassSanitizationTrustResourceUrl}.
 *
 * @param unsafeResourceUrl untrusted `url`, typically from the user.
 * @returns `url` string which is safe to bind to the `src` properties such as `<img src>`, because
 * only trusted `url`s have been allowed to pass.
 *
 * @publicApi
 */
export function ɵɵsanitizeResourceUrl(unsafeResourceUrl: any): string {
  const sanitizer = getSanitizer();
  if (sanitizer) {
    return sanitizer.sanitize(SecurityContext.RESOURCE_URL, unsafeResourceUrl) || '';
  }
  if (allowSanitizationBypassAndThrow(unsafeResourceUrl, BypassType.ResourceUrl)) {
    return unwrapSafeValue(unsafeResourceUrl);
  }
  throw new Error('unsafe value used in a resource URL context (see http://g.co/ng/security#xss)');
}

/**
 * A `script` sanitizer which only lets trusted javascript through.
 *
 * This passes only `script`s marked trusted by calling {@link
 * bypassSanitizationTrustScript}.
 *
 * @param unsafeScript untrusted `script`, typically from the user.
 * @returns `url` string which is safe to bind to the `<script>` element such as `<img src>`,
 * because only trusted `scripts` have been allowed to pass.
 *
 * @publicApi
 */
export function ɵɵsanitizeScript(unsafeScript: any): string {
  const sanitizer = getSanitizer();
  if (sanitizer) {
    return sanitizer.sanitize(SecurityContext.SCRIPT, unsafeScript) || '';
  }
  if (allowSanitizationBypassAndThrow(unsafeScript, BypassType.Script)) {
    return unwrapSafeValue(unsafeScript);
  }
  throw new Error('unsafe value used in a script context');
}

/**
 * Detects which sanitizer to use for URL property, based on tag name and prop name.
 *
 * The rules are based on the RESOURCE_URL context config from
 * `packages/compiler/src/schema/dom_security_schema.ts`.
 * If tag and prop names don't match Resource URL schema, use URL sanitizer.
 */
export function getUrlSanitizer(tag: string, prop: string) {
  if ((prop === 'src' && (tag === 'embed' || tag === 'frame' || tag === 'iframe' ||
                          tag === 'media' || tag === 'script')) ||
      (prop === 'href' && (tag === 'base' || tag === 'link'))) {
    return ɵɵsanitizeResourceUrl;
  }
  return ɵɵsanitizeUrl;
}

/**
 * Sanitizes URL, selecting sanitizer function based on tag and property names.
 *
 * This function is used in case we can't define security context at compile time, when only prop
 * name is available. This happens when we generate host bindings for Directives/Components. The
 * host element is unknown at compile time, so we defer calculation of specific sanitizer to
 * runtime.
 *
 * @param unsafeUrl untrusted `url`, typically from the user.
 * @param tag target element tag name.
 * @param prop name of the property that contains the value.
 * @returns `url` string which is safe to bind.
 *
 * @publicApi
 */
export function ɵɵsanitizeUrlOrResourceUrl(unsafeUrl: any, tag: string, prop: string): any {
  return getUrlSanitizer(tag, prop)(unsafeUrl);
}

/**
 * The default style sanitizer will handle sanitization for style properties by
 * sanitizing any CSS property that can include a `url` value (usually image-based properties)
 *
 * @publicApi
 */
export const ɵɵdefaultStyleSanitizer =
    (function(prop: string, value: string|null, mode?: StyleSanitizeMode): string | boolean | null {
      mode = mode || StyleSanitizeMode.ValidateAndSanitize;
      let doSanitizeValue = true;
      if (mode & StyleSanitizeMode.ValidateProperty) {
        doSanitizeValue = prop === 'background-image' || prop === 'background' ||
            prop === 'border-image' || prop === 'filter' || prop === 'list-style' ||
            prop === 'list-style-image' || prop === 'clip-path';
      }

      if (mode & StyleSanitizeMode.SanitizeOnly) {
        return doSanitizeValue ? ɵɵsanitizeStyle(value) : value;
      } else {
        return doSanitizeValue;
      }
    } as StyleSanitizeFn);

export function validateAgainstEventProperties(name: string) {
  if (name.toLowerCase().startsWith('on')) {
    const msg = `Binding to event property '${name}' is disallowed for security reasons, ` +
        `please use (${name.slice(2)})=...` +
        `\nIf '${name}' is a directive input, make sure the directive is imported by the` +
        ` current module.`;
    throw new Error(msg);
  }
}

export function validateAgainstEventAttributes(name: string) {
  if (name.toLowerCase().startsWith('on')) {
    const msg = `Binding to event attribute '${name}' is disallowed for security reasons, ` +
        `please use (${name.slice(2)})=...`;
    throw new Error(msg);
  }
}

function getSanitizer(): Sanitizer|null {
  const lView = getLView();
  return lView && lView[SANITIZER];
}
