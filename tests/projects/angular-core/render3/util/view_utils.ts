/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {assertDataInRange, assertDefined, assertDomNode, assertGreaterThan, assertLessThan} from '../../util/assert';
import {assertTNodeForLView} from '../assert';
import {ACTIVE_INDEX, ActiveIndexFlag, LContainer, TYPE} from '../interfaces/container';
import {LContext, MONKEY_PATCH_KEY_NAME} from '../interfaces/context';
import {TConstants, TNode} from '../interfaces/node';
import {RNode, isProceduralRenderer} from '../interfaces/renderer';
import {isLContainer, isLView} from '../interfaces/type_checks';
import {FLAGS, HEADER_OFFSET, HOST, LView, LViewFlags, PARENT, PREORDER_HOOK_FLAGS, RENDERER, TData, TVIEW} from '../interfaces/view';



/**
 * For efficiency reasons we often put several different data types (`RNode`, `LView`, `LContainer`)
 * in same location in `LView`. This is because we don't want to pre-allocate space for it
 * because the storage is sparse. This file contains utilities for dealing with such data types.
 *
 * How do we know what is stored at a given location in `LView`.
 * - `Array.isArray(value) === false` => `RNode` (The normal storage value)
 * - `Array.isArray(value) === true` => then the `value[0]` represents the wrapped value.
 *   - `typeof value[TYPE] === 'object'` => `LView`
 *      - This happens when we have a component at a given location
 *   - `typeof value[TYPE] === true` => `LContainer`
 *      - This happens when we have `LContainer` binding at a given location.
 *
 *
 * NOTE: it is assumed that `Array.isArray` and `typeof` operations are very efficient.
 */

/**
 * Returns `RNode`.
 * @param value wrapped value of `RNode`, `LView`, `LContainer`
 */
export function unwrapRNode(value: RNode | LView | LContainer): RNode {
  while (Array.isArray(value)) {
    value = value[HOST] as any;
  }
  return value as RNode;
}

/**
 * Returns `LView` or `null` if not found.
 * @param value wrapped value of `RNode`, `LView`, `LContainer`
 */
export function unwrapLView(value: RNode | LView | LContainer): LView|null {
  while (Array.isArray(value)) {
    // This check is same as `isLView()` but we don't call at as we don't want to call
    // `Array.isArray()` twice and give JITer more work for inlining.
    if (typeof value[TYPE] === 'object') return value as LView;
    value = value[HOST] as any;
  }
  return null;
}

/**
 * Returns `LContainer` or `null` if not found.
 * @param value wrapped value of `RNode`, `LView`, `LContainer`
 */
export function unwrapLContainer(value: RNode | LView | LContainer): LContainer|null {
  while (Array.isArray(value)) {
    // This check is same as `isLContainer()` but we don't call at as we don't want to call
    // `Array.isArray()` twice and give JITer more work for inlining.
    if (value[TYPE] === true) return value as LContainer;
    value = value[HOST] as any;
  }
  return null;
}

/**
 * Retrieves an element value from the provided `viewData`, by unwrapping
 * from any containers, component views, or style contexts.
 */
export function getNativeByIndex(index: number, lView: LView): RNode {
  return unwrapRNode(lView[index + HEADER_OFFSET]);
}

/**
 * Retrieve an `RNode` for a given `TNode` and `LView`.
 *
 * This function guarantees in dev mode to retrieve a non-null `RNode`.
 *
 * @param tNode
 * @param lView
 */
export function getNativeByTNode(tNode: TNode, lView: LView): RNode {
  ngDevMode && assertTNodeForLView(tNode, lView);
  ngDevMode && assertDataInRange(lView, tNode.index);
  const node: RNode = unwrapRNode(lView[tNode.index]);
  ngDevMode && !isProceduralRenderer(lView[RENDERER]) && assertDomNode(node);
  return node;
}

/**
 * Retrieve an `RNode` or `null` for a given `TNode` and `LView`.
 *
 * Some `TNode`s don't have associated `RNode`s. For example `Projection`
 *
 * @param tNode
 * @param lView
 */
export function getNativeByTNodeOrNull(tNode: TNode, lView: LView): RNode|null {
  const index = tNode.index;
  if (index !== -1) {
    ngDevMode && assertTNodeForLView(tNode, lView);
    const node: RNode|null = unwrapRNode(lView[index]);
    ngDevMode && node !== null && !isProceduralRenderer(lView[RENDERER]) && assertDomNode(node);
    return node;
  }
  return null;
}


export function getTNode(index: number, view: LView): TNode {
  ngDevMode && assertGreaterThan(index, -1, 'wrong index for TNode');
  ngDevMode && assertLessThan(index, view[TVIEW].data.length, 'wrong index for TNode');
  return view[TVIEW].data[index + HEADER_OFFSET] as TNode;
}

/** Retrieves a value from any `LView` or `TData`. */
export function load<T>(view: LView | TData, index: number): T {
  ngDevMode && assertDataInRange(view, index + HEADER_OFFSET);
  return view[index + HEADER_OFFSET];
}

export function getComponentLViewByIndex(nodeIndex: number, hostView: LView): LView {
  // Could be an LView or an LContainer. If LContainer, unwrap to find LView.
  ngDevMode && assertDataInRange(hostView, nodeIndex);
  const slotValue = hostView[nodeIndex];
  const lView = isLView(slotValue) ? slotValue : slotValue[HOST];
  return lView;
}


/**
 * Returns the monkey-patch value data present on the target (which could be
 * a component, directive or a DOM node).
 */
export function readPatchedData(target: any): LView|LContext|null {
  ngDevMode && assertDefined(target, 'Target expected');
  return target[MONKEY_PATCH_KEY_NAME] || null;
}

export function readPatchedLView(target: any): LView|null {
  const value = readPatchedData(target);
  if (value) {
    return Array.isArray(value) ? value : (value as LContext).lView;
  }
  return null;
}

/** Checks whether a given view is in creation mode */
export function isCreationMode(view: LView): boolean {
  return (view[FLAGS] & LViewFlags.CreationMode) === LViewFlags.CreationMode;
}

/**
 * Returns a boolean for whether the view is attached to the change detection tree.
 *
 * Note: This determines whether a view should be checked, not whether it's inserted
 * into a container. For that, you'll want `viewAttachedToContainer` below.
 */
export function viewAttachedToChangeDetector(view: LView): boolean {
  return (view[FLAGS] & LViewFlags.Attached) === LViewFlags.Attached;
}

/** Returns a boolean for whether the view is attached to a container. */
export function viewAttachedToContainer(view: LView): boolean {
  return isLContainer(view[PARENT]);
}

/** Returns a constant from `TConstants` instance. */
export function getConstant<T>(consts: TConstants | null, index: number | null | undefined): T|
    null {
  return consts === null || index == null ? null : consts[index] as unknown as T;
}

/**
 * Resets the pre-order hook flags of the view.
 * @param lView the LView on which the flags are reset
 */
export function resetPreOrderHookFlags(lView: LView) {
  lView[PREORDER_HOOK_FLAGS] = 0;
}

export function getLContainerActiveIndex(lContainer: LContainer) {
  return lContainer[ACTIVE_INDEX] >> ActiveIndexFlag.SHIFT;
}

export function setLContainerActiveIndex(lContainer: LContainer, index: number) {
  lContainer[ACTIVE_INDEX] = index << ActiveIndexFlag.SHIFT;
}