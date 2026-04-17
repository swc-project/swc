/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 */

type Groups = { [key: number]: { start: ?number, rules: Array<string> } };
type Selectors = { [key: string]: boolean };

export type OrderedCSSStyleSheet = {|
  getTextContent: () => string,
  insert: (cssText: string, groupValue: number) => void
|};

const slice = Array.prototype.slice;

/**
 * Order-based insertion of CSS.
 *
 * Each rule is associated with a numerically defined group.
 * Groups are ordered within the style sheet according to their number, with the
 * lowest first.
 *
 * Groups are implemented using marker rules. The selector of the first rule of
 * each group is used only to encode the group number for hydration. An
 * alternative implementation could rely on CSSMediaRule, allowing groups to be
 * treated as a sub-sheet, but the Edge implementation of CSSMediaRule is
 * broken.
 * https://developer.mozilla.org/en-US/docs/Web/API/CSSMediaRule
 * https://gist.github.com/necolas/aa0c37846ad6bd3b05b727b959e82674
 */
export default function createOrderedCSSStyleSheet(
  sheet: ?CSSStyleSheet
): OrderedCSSStyleSheet {
  const groups: Groups = {};
  const selectors: Selectors = {};

  /**
   * Hydrate approximate record from any existing rules in the sheet.
   */
  if (sheet != null) {
    let group;
    slice.call(sheet.cssRules).forEach((cssRule, i) => {
      const cssText = cssRule.cssText;
      // Create record of existing selectors and rules
      if (cssText.indexOf('stylesheet-group') > -1) {
        group = decodeGroupRule(cssRule);
        groups[group] = { start: i, rules: [cssText] };
      } else {
        const selectorText = getSelectorText(cssText);
        if (selectorText != null) {
          selectors[selectorText] = true;
          groups[group].rules.push(cssText);
        }
      }
    });
  }

  function sheetInsert(sheet, group, text) {
    const orderedGroups = getOrderedGroups(groups);
    const groupIndex = orderedGroups.indexOf(group);
    const nextGroupIndex = groupIndex + 1;
    const nextGroup = orderedGroups[nextGroupIndex];
    // Insert rule before the next group, or at the end of the stylesheet
    const position =
      nextGroup != null && groups[nextGroup].start != null
        ? groups[nextGroup].start
        : sheet.cssRules.length;
    const isInserted = insertRuleAt(sheet, text, position);

    if (isInserted) {
      // Set the starting index of the new group
      if (groups[group].start == null) {
        groups[group].start = position;
      }
      // Increment the starting index of all subsequent groups
      for (let i = nextGroupIndex; i < orderedGroups.length; i += 1) {
        const groupNumber = orderedGroups[i];
        const previousStart = groups[groupNumber].start || 0;
        groups[groupNumber].start = previousStart + 1;
      }
    }

    return isInserted;
  }

  const OrderedCSSStyleSheet = {
    /**
     * The textContent of the style sheet.
     */
    getTextContent(): string {
      return getOrderedGroups(groups)
        .map((group) => {
          const rules = groups[group].rules;
          // Sorting provides deterministic order of styles in group for
          // build-time extraction of the style sheet.
          const marker = rules.shift();
          rules.sort();
          rules.unshift(marker);
          return rules.join('\n');
        })
        .join('\n');
    },

    /**
     * Insert a rule into the style sheet
     */
    insert(cssText: string, groupValue: number) {
      const group = Number(groupValue);

      // Create a new group.
      if (groups[group] == null) {
        const markerRule = encodeGroupRule(group);
        // Create the internal record.
        groups[group] = { start: null, rules: [markerRule] };
        // Update CSSOM.
        if (sheet != null) {
          sheetInsert(sheet, group, markerRule);
        }
      }

      // selectorText is more reliable than cssText for insertion checks. The
      // browser excludes vendor-prefixed properties and rewrites certain values
      // making cssText more likely to be different from what was inserted.
      const selectorText = getSelectorText(cssText);
      if (selectorText != null && selectors[selectorText] == null) {
        // Update the internal records.
        selectors[selectorText] = true;
        groups[group].rules.push(cssText);
        // Update CSSOM.
        if (sheet != null) {
          const isInserted = sheetInsert(sheet, group, cssText);
          if (!isInserted) {
            // Revert internal record change if a rule was rejected (e.g.,
            // unrecognized pseudo-selector)
            groups[group].rules.pop();
          }
        }
      }
    }
  };

  return OrderedCSSStyleSheet;
}

/**
 * Helper functions
 */

function encodeGroupRule(group) {
  return `[stylesheet-group="${group}"]{}`;
}

const groupPattern = /["']/g;
function decodeGroupRule(cssRule) {
  return Number(cssRule.selectorText.split(groupPattern)[1]);
}

function getOrderedGroups(obj: { [key: number]: any }) {
  return Object.keys(obj)
    .map(Number)
    .sort((a, b) => (a > b ? 1 : -1));
}

const selectorPattern = /\s*([,])\s*/g;
function getSelectorText(cssText) {
  const selector = cssText.split('{')[0].trim();
  return selector !== '' ? selector.replace(selectorPattern, '$1') : null;
}

function insertRuleAt(root, cssText: string, position: number): boolean {
  try {
    // $FlowFixMe: Flow is missing CSSOM types needed to type 'root'.
    root.insertRule(cssText, position);
    return true;
  } catch (e) {
    // JSDOM doesn't support `CSSSMediaRule#insertRule`.
    // Also ignore errors that occur from attempting to insert vendor-prefixed selectors.
    return false;
  }
}
