/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {assertDataInRange, assertEqual} from '../../util/assert';
import {assertHasParent} from '../assert';
import {attachPatchData} from '../context_discovery';
import {registerPostOrderHooks} from '../hooks';
import {TAttributes, TElementContainerNode, TNodeType} from '../interfaces/node';
import {isContentQueryHost, isDirectiveHost} from '../interfaces/type_checks';
import {HEADER_OFFSET, LView, RENDERER, TVIEW, TView, T_HOST} from '../interfaces/view';
import {assertNodeType} from '../node_assert';
import {appendChild} from '../node_manipulation';
import {getBindingIndex, getIsParent, getLView, getPreviousOrParentTNode, setIsNotParent, setPreviousOrParentTNode} from '../state';
import {getConstant} from '../util/view_utils';

import {createDirectivesInstances, executeContentQueries, getOrCreateTNode, resolveDirectives, saveResolvedLocalsInData} from './shared';
import {registerInitialStylingOnTNode} from './styling';

function elementContainerStartFirstCreatePass(
    index: number, tView: TView, lView: LView, attrsIndex?: number | null,
    localRefsIndex?: number): TElementContainerNode {
  ngDevMode && ngDevMode.firstCreatePass++;

  const tViewConsts = tView.consts;
  const attrs = getConstant<TAttributes>(tViewConsts, attrsIndex);
  const tNode = getOrCreateTNode(
      tView, lView[T_HOST], index, TNodeType.ElementContainer, 'ng-container', attrs);

  // While ng-container doesn't necessarily support styling, we use the style context to identify
  // and execute directives on the ng-container.
  if (attrs !== null) {
    registerInitialStylingOnTNode(tNode, attrs, 0);
  }

  const localRefs = getConstant<string[]>(tViewConsts, localRefsIndex);
  resolveDirectives(tView, lView, tNode, localRefs);

  if (tView.queries !== null) {
    tView.queries.elementStart(tView, tNode);
  }

  return tNode;
}

/**
 * Creates a logical container for other nodes (<ng-container>) backed by a comment node in the DOM.
 * The instruction must later be followed by `elementContainerEnd()` call.
 *
 * @param index Index of the element in the LView array
 * @param attrsIndex Index of the container attributes in the `consts` array.
 * @param localRefsIndex Index of the container's local references in the `consts` array.
 *
 * Even if this instruction accepts a set of attributes no actual attribute values are propagated to
 * the DOM (as a comment node can't have attributes). Attributes are here only for directive
 * matching purposes and setting initial inputs of directives.
 *
 * @codeGenApi
 */
export function ɵɵelementContainerStart(
    index: number, attrsIndex?: number | null, localRefsIndex?: number): void {
  const lView = getLView();
  const tView = lView[TVIEW];
  const adjustedIndex = index + HEADER_OFFSET;

  ngDevMode && assertDataInRange(lView, adjustedIndex);
  ngDevMode && assertEqual(
                   getBindingIndex(), tView.bindingStartIndex,
                   'element containers should be created before any bindings');

  const tNode = tView.firstCreatePass ?
      elementContainerStartFirstCreatePass(index, tView, lView, attrsIndex, localRefsIndex) :
      tView.data[adjustedIndex] as TElementContainerNode;
  setPreviousOrParentTNode(tNode, true);

  ngDevMode && ngDevMode.rendererCreateComment++;
  const native = lView[adjustedIndex] =
      lView[RENDERER].createComment(ngDevMode ? 'ng-container' : '');
  appendChild(native, tNode, lView);
  attachPatchData(native, lView);

  if (isDirectiveHost(tNode)) {
    createDirectivesInstances(tView, lView, tNode);
    executeContentQueries(tView, tNode, lView);
  }

  if (localRefsIndex != null) {
    saveResolvedLocalsInData(lView, tNode);
  }
}

/**
 * Mark the end of the <ng-container>.
 *
 * @codeGenApi
 */
export function ɵɵelementContainerEnd(): void {
  let previousOrParentTNode = getPreviousOrParentTNode();
  const lView = getLView();
  const tView = lView[TVIEW];
  if (getIsParent()) {
    setIsNotParent();
  } else {
    ngDevMode && assertHasParent(previousOrParentTNode);
    previousOrParentTNode = previousOrParentTNode.parent !;
    setPreviousOrParentTNode(previousOrParentTNode, false);
  }

  ngDevMode && assertNodeType(previousOrParentTNode, TNodeType.ElementContainer);

  if (tView.firstCreatePass) {
    registerPostOrderHooks(tView, previousOrParentTNode);
    if (isContentQueryHost(previousOrParentTNode)) {
      tView.queries !.elementEnd(previousOrParentTNode);
    }
  }
}

/**
 * Creates an empty logical container using {@link elementContainerStart}
 * and {@link elementContainerEnd}
 *
 * @param index Index of the element in the LView array
 * @param attrsIndex Index of the container attributes in the `consts` array.
 * @param localRefsIndex Index of the container's local references in the `consts` array.
 *
 * @codeGenApi
 */
export function ɵɵelementContainer(
    index: number, attrsIndex?: number | null, localRefsIndex?: number): void {
  ɵɵelementContainerStart(index, attrsIndex, localRefsIndex);
  ɵɵelementContainerEnd();
}
