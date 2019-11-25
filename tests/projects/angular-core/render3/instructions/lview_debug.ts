/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {AttributeMarker, ComponentTemplate} from '..';
import {SchemaMetadata} from '../../core';
import {assertDefined} from '../../util/assert';
import {createNamedArrayType} from '../../util/named_array_type';
import {initNgDevMode} from '../../util/ng_dev_mode';
import {ACTIVE_INDEX, ActiveIndexFlag, CONTAINER_HEADER_OFFSET, LContainer, MOVED_VIEWS, NATIVE} from '../interfaces/container';
import {DirectiveDefList, PipeDefList, ViewQueriesFunction} from '../interfaces/definition';
import {COMMENT_MARKER, ELEMENT_MARKER, I18nMutateOpCode, I18nMutateOpCodes, I18nUpdateOpCode, I18nUpdateOpCodes, TIcu} from '../interfaces/i18n';
import {PropertyAliases, TConstants, TContainerNode, TElementNode, TNode as ITNode, TNode, TNodeFlags, TNodeProviderIndexes, TNodeType, TViewNode} from '../interfaces/node';
import {SelectorFlags} from '../interfaces/projection';
import {TQueries} from '../interfaces/query';
import {RComment, RElement, RNode} from '../interfaces/renderer';
import {TStylingContext} from '../interfaces/styling';
import {CHILD_HEAD, CHILD_TAIL, CLEANUP, CONTEXT, DECLARATION_VIEW, ExpandoInstructions, FLAGS, HEADER_OFFSET, HOST, HookData, INJECTOR, LView, LViewFlags, NEXT, PARENT, QUERIES, RENDERER, RENDERER_FACTORY, SANITIZER, TData, TVIEW, TView as ITView, TView, TViewType, T_HOST} from '../interfaces/view';
import {DebugNodeStyling, NodeStylingDebug} from '../styling/styling_debug';
import {attachDebugObject} from '../util/debug_utils';
import {isStylingContext} from '../util/styling_utils';
import {getLContainerActiveIndex, getTNode, unwrapRNode} from '../util/view_utils';

const NG_DEV_MODE = ((typeof ngDevMode === 'undefined' || !!ngDevMode) && initNgDevMode());

/*
 * This file contains conditionally attached classes which provide human readable (debug) level
 * information for `LView`, `LContainer` and other internal data structures. These data structures
 * are stored internally as array which makes it very difficult during debugging to reason about the
 * current state of the system.
 *
 * Patching the array with extra property does change the array's hidden class' but it does not
 * change the cost of access, therefore this patching should not have significant if any impact in
 * `ngDevMode` mode. (see: https://jsperf.com/array-vs-monkey-patch-array)
 *
 * So instead of seeing:
 * ```
 * Array(30) [Object, 659, null, …]
 * ```
 *
 * You get to see:
 * ```
 * LViewDebug {
 *   views: [...],
 *   flags: {attached: true, ...}
 *   nodes: [
 *     {html: '<div id="123">', ..., nodes: [
 *       {html: '<span>', ..., nodes: null}
 *     ]}
 *   ]
 * }
 * ```
 */

let LVIEW_COMPONENT_CACHE !: Map<string|null, Array<any>>;
let LVIEW_EMBEDDED_CACHE !: Map<string|null, Array<any>>;
let LVIEW_ROOT !: Array<any>;

interface TViewDebug extends ITView {
  type: TViewType;
}

/**
 * This function clones a blueprint and creates LView.
 *
 * Simple slice will keep the same type, and we need it to be LView
 */
export function cloneToLViewFromTViewBlueprint(tView: TView): LView {
  const debugTView = tView as TViewDebug;
  const lView = getLViewToClone(debugTView.type, tView.template && tView.template.name);
  return lView.concat(tView.blueprint) as any;
}

function getLViewToClone(type: TViewType, name: string | null): Array<any> {
  switch (type) {
    case TViewType.Root:
      if (LVIEW_ROOT === undefined) LVIEW_ROOT = new (createNamedArrayType('LRootView'))();
      return LVIEW_ROOT;
    case TViewType.Component:
      if (LVIEW_COMPONENT_CACHE === undefined) LVIEW_COMPONENT_CACHE = new Map();
      let componentArray = LVIEW_COMPONENT_CACHE.get(name);
      if (componentArray === undefined) {
        componentArray = new (createNamedArrayType('LComponentView' + nameSuffix(name)))();
        LVIEW_COMPONENT_CACHE.set(name, componentArray);
      }
      return componentArray;
    case TViewType.Embedded:
      if (LVIEW_EMBEDDED_CACHE === undefined) LVIEW_EMBEDDED_CACHE = new Map();
      let embeddedArray = LVIEW_EMBEDDED_CACHE.get(name);
      if (embeddedArray === undefined) {
        embeddedArray = new (createNamedArrayType('LEmbeddedView' + nameSuffix(name)))();
        LVIEW_EMBEDDED_CACHE.set(name, embeddedArray);
      }
      return embeddedArray;
  }
  throw new Error('unreachable code');
}

function nameSuffix(text: string | null | undefined): string {
  if (text == null) return '';
  const index = text.lastIndexOf('_Template');
  return '_' + (index === -1 ? text : text.substr(0, index));
}

/**
 * This class is a debug version of Object literal so that we can have constructor name show up
 * in
 * debug tools in ngDevMode.
 */
export const TViewConstructor = class TView implements ITView {
  constructor(
      public type: TViewType,                                //
      public id: number,                                     //
      public blueprint: LView,                               //
      public template: ComponentTemplate<{}>|null,           //
      public queries: TQueries|null,                         //
      public viewQuery: ViewQueriesFunction<{}>|null,        //
      public node: TViewNode|TElementNode|null,              //
      public data: TData,                                    //
      public bindingStartIndex: number,                      //
      public expandoStartIndex: number,                      //
      public expandoInstructions: ExpandoInstructions|null,  //
      public firstCreatePass: boolean,                       //
      public firstUpdatePass: boolean,                       //
      public staticViewQueries: boolean,                     //
      public staticContentQueries: boolean,                  //
      public preOrderHooks: HookData|null,                   //
      public preOrderCheckHooks: HookData|null,              //
      public contentHooks: HookData|null,                    //
      public contentCheckHooks: HookData|null,               //
      public viewHooks: HookData|null,                       //
      public viewCheckHooks: HookData|null,                  //
      public destroyHooks: HookData|null,                    //
      public cleanup: any[]|null,                            //
      public contentQueries: number[]|null,                  //
      public components: number[]|null,                      //
      public directiveRegistry: DirectiveDefList|null,       //
      public pipeRegistry: PipeDefList|null,                 //
      public firstChild: TNode|null,                         //
      public schemas: SchemaMetadata[]|null,                 //
      public consts: TConstants|null,                        //
      ) {}

  get template_(): string {
    const buf: string[] = [];
    processTNodeChildren(this.firstChild, buf);
    return buf.join('');
  }
};

export const TNodeConstructor = class TNode implements ITNode {
  constructor(
      public tView_: TView,                                                    //
      public type: TNodeType,                                                  //
      public index: number,                                                    //
      public injectorIndex: number,                                            //
      public directiveStart: number,                                           //
      public directiveEnd: number,                                             //
      public propertyBindings: number[]|null,                                  //
      public flags: TNodeFlags,                                                //
      public providerIndexes: TNodeProviderIndexes,                            //
      public tagName: string|null,                                             //
      public attrs: (string|AttributeMarker|(string|SelectorFlags)[])[]|null,  //
      public localNames: (string|number)[]|null,                               //
      public initialInputs: (string[]|null)[]|null|undefined,                  //
      public inputs: PropertyAliases|null,                                     //
      public outputs: PropertyAliases|null,                                    //
      public tViews: ITView|ITView[]|null,                                     //
      public next: ITNode|null,                                                //
      public projectionNext: ITNode|null,                                      //
      public child: ITNode|null,                                               //
      public parent: TElementNode|TContainerNode|null,                         //
      public projection: number|(ITNode|RNode[])[]|null,                       //
      public styles: TStylingContext|null,                                     //
      public classes: TStylingContext|null,                                    //
      ) {}

  get type_(): string {
    switch (this.type) {
      case TNodeType.Container:
        return 'TNodeType.Container';
      case TNodeType.Element:
        return 'TNodeType.Element';
      case TNodeType.ElementContainer:
        return 'TNodeType.ElementContainer';
      case TNodeType.IcuContainer:
        return 'TNodeType.IcuContainer';
      case TNodeType.Projection:
        return 'TNodeType.Projection';
      case TNodeType.View:
        return 'TNodeType.View';
      default:
        return 'TNodeType.???';
    }
  }

  get flags_(): string {
    const flags: string[] = [];
    if (this.flags & TNodeFlags.hasClassInput) flags.push('TNodeFlags.hasClassInput');
    if (this.flags & TNodeFlags.hasContentQuery) flags.push('TNodeFlags.hasContentQuery');
    if (this.flags & TNodeFlags.hasStyleInput) flags.push('TNodeFlags.hasStyleInput');
    if (this.flags & TNodeFlags.hasInitialStyling) flags.push('TNodeFlags.hasInitialStyling');
    if (this.flags & TNodeFlags.hasHostBindings) flags.push('TNodeFlags.hasHostBindings');
    if (this.flags & TNodeFlags.isComponentHost) flags.push('TNodeFlags.isComponentHost');
    if (this.flags & TNodeFlags.isDirectiveHost) flags.push('TNodeFlags.isDirectiveHost');
    if (this.flags & TNodeFlags.isDetached) flags.push('TNodeFlags.isDetached');
    if (this.flags & TNodeFlags.isProjected) flags.push('TNodeFlags.isProjected');
    return flags.join('|');
  }

  get template_(): string {
    const buf: string[] = [];
    buf.push('<', this.tagName || this.type_);
    if (this.attrs) {
      for (let i = 0; i < this.attrs.length;) {
        const attrName = this.attrs[i++];
        if (typeof attrName == 'number') {
          break;
        }
        const attrValue = this.attrs[i++];
        buf.push(' ', attrName as string, '="', attrValue as string, '"');
      }
    }
    buf.push('>');
    processTNodeChildren(this.child, buf);
    buf.push('</', this.tagName || this.type_, '>');
    return buf.join('');
  }
};

function processTNodeChildren(tNode: TNode | null, buf: string[]) {
  while (tNode) {
    buf.push((tNode as any as{template_: string}).template_);
    tNode = tNode.next;
  }
}

const TViewData = NG_DEV_MODE && createNamedArrayType('TViewData') || null !as ArrayConstructor;
let TVIEWDATA_EMPTY:
    unknown[];  // can't initialize here or it will not be tree shaken, because `LView`
                // constructor could have side-effects.
/**
 * This function clones a blueprint and creates TData.
 *
 * Simple slice will keep the same type, and we need it to be TData
 */
export function cloneToTViewData(list: any[]): TData {
  if (TVIEWDATA_EMPTY === undefined) TVIEWDATA_EMPTY = new TViewData();
  return TVIEWDATA_EMPTY.concat(list) as any;
}

export const LViewBlueprint =
    NG_DEV_MODE && createNamedArrayType('LViewBlueprint') || null !as ArrayConstructor;
export const MatchesArray =
    NG_DEV_MODE && createNamedArrayType('MatchesArray') || null !as ArrayConstructor;
export const TViewComponents =
    NG_DEV_MODE && createNamedArrayType('TViewComponents') || null !as ArrayConstructor;
export const TNodeLocalNames =
    NG_DEV_MODE && createNamedArrayType('TNodeLocalNames') || null !as ArrayConstructor;
export const TNodeInitialInputs =
    NG_DEV_MODE && createNamedArrayType('TNodeInitialInputs') || null !as ArrayConstructor;
export const TNodeInitialData =
    NG_DEV_MODE && createNamedArrayType('TNodeInitialData') || null !as ArrayConstructor;
export const LCleanup =
    NG_DEV_MODE && createNamedArrayType('LCleanup') || null !as ArrayConstructor;
export const TCleanup =
    NG_DEV_MODE && createNamedArrayType('TCleanup') || null !as ArrayConstructor;



export function attachLViewDebug(lView: LView) {
  attachDebugObject(lView, new LViewDebug(lView));
}

export function attachLContainerDebug(lContainer: LContainer) {
  attachDebugObject(lContainer, new LContainerDebug(lContainer));
}

export function toDebug(obj: LView): LViewDebug;
export function toDebug(obj: LView | null): LViewDebug|null;
export function toDebug(obj: LView | LContainer | null): LViewDebug|LContainerDebug|null;
export function toDebug(obj: any): any {
  if (obj) {
    const debug = (obj as any).debug;
    assertDefined(debug, 'Object does not have a debug representation.');
    return debug;
  } else {
    return obj;
  }
}

/**
 * Use this method to unwrap a native element in `LView` and convert it into HTML for easier
 * reading.
 *
 * @param value possibly wrapped native DOM node.
 * @param includeChildren If `true` then the serialized HTML form will include child elements
 * (same
 * as `outerHTML`). If `false` then the serialized HTML form will only contain the element
 * itself
 * (will not serialize child elements).
 */
function toHtml(value: any, includeChildren: boolean = false): string|null {
  const node: HTMLElement|null = unwrapRNode(value) as any;
  if (node) {
    const isTextNode = node.nodeType === Node.TEXT_NODE;
    const outerHTML = (isTextNode ? node.textContent : node.outerHTML) || '';
    if (includeChildren || isTextNode) {
      return outerHTML;
    } else {
      const innerHTML = '>' + node.innerHTML + '<';
      return (outerHTML.split(innerHTML)[0]) + '>';
    }
  } else {
    return null;
  }
}

export class LViewDebug {
  constructor(private readonly _raw_lView: LView) {}

  /**
   * Flags associated with the `LView` unpacked into a more readable state.
   */
  get flags() {
    const flags = this._raw_lView[FLAGS];
    return {
      __raw__flags__: flags,
      initPhaseState: flags & LViewFlags.InitPhaseStateMask,
      creationMode: !!(flags & LViewFlags.CreationMode),
      firstViewPass: !!(flags & LViewFlags.FirstLViewPass),
      checkAlways: !!(flags & LViewFlags.CheckAlways),
      dirty: !!(flags & LViewFlags.Dirty),
      attached: !!(flags & LViewFlags.Attached),
      destroyed: !!(flags & LViewFlags.Destroyed),
      isRoot: !!(flags & LViewFlags.IsRoot),
      indexWithinInitPhase: flags >> LViewFlags.IndexWithinInitPhaseShift,
    };
  }
  get parent(): LViewDebug|LContainerDebug|null { return toDebug(this._raw_lView[PARENT]); }
  get host(): string|null { return toHtml(this._raw_lView[HOST], true); }
  get html(): string { return (this.nodes || []).map(node => toHtml(node.native, true)).join(''); }
  get context(): {}|null { return this._raw_lView[CONTEXT]; }
  /**
   * The tree of nodes associated with the current `LView`. The nodes have been normalized into
   * a
   * tree structure with relevant details pulled out for readability.
   */
  get nodes(): DebugNode[]|null {
    const lView = this._raw_lView;
    const tNode = lView[TVIEW].firstChild;
    return toDebugNodes(tNode, lView);
  }

  get tView() { return this._raw_lView[TVIEW]; }
  get cleanup() { return this._raw_lView[CLEANUP]; }
  get injector() { return this._raw_lView[INJECTOR]; }
  get rendererFactory() { return this._raw_lView[RENDERER_FACTORY]; }
  get renderer() { return this._raw_lView[RENDERER]; }
  get sanitizer() { return this._raw_lView[SANITIZER]; }
  get childHead() { return toDebug(this._raw_lView[CHILD_HEAD]); }
  get next() { return toDebug(this._raw_lView[NEXT]); }
  get childTail() { return toDebug(this._raw_lView[CHILD_TAIL]); }
  get declarationView() { return toDebug(this._raw_lView[DECLARATION_VIEW]); }
  get queries() { return this._raw_lView[QUERIES]; }
  get tHost() { return this._raw_lView[T_HOST]; }

  /**
   * Normalized view of child views (and containers) attached at this location.
   */
  get childViews(): Array<LViewDebug|LContainerDebug> {
    const childViews: Array<LViewDebug|LContainerDebug> = [];
    let child = this.childHead;
    while (child) {
      childViews.push(child);
      child = child.next;
    }
    return childViews;
  }
}

export interface DebugNode {
  html: string|null;
  native: Node;
  styles: DebugNodeStyling|null;
  classes: DebugNodeStyling|null;
  nodes: DebugNode[]|null;
  component: LViewDebug|null;
}

/**
 * Turns a flat list of nodes into a tree by walking the associated `TNode` tree.
 *
 * @param tNode
 * @param lView
 */
export function toDebugNodes(tNode: TNode | null, lView: LView): DebugNode[]|null {
  if (tNode) {
    const debugNodes: DebugNode[] = [];
    let tNodeCursor: TNode|null = tNode;
    while (tNodeCursor) {
      debugNodes.push(buildDebugNode(tNodeCursor, lView, tNodeCursor.index));
      tNodeCursor = tNodeCursor.next;
    }
    return debugNodes;
  } else {
    return null;
  }
}

export function buildDebugNode(tNode: TNode, lView: LView, nodeIndex: number): DebugNode {
  const rawValue = lView[nodeIndex];
  const native = unwrapRNode(rawValue);
  const componentLViewDebug = toDebug(readLViewValue(rawValue));
  const styles = isStylingContext(tNode.styles) ?
      new NodeStylingDebug(tNode.styles as any as TStylingContext, tNode, lView, false) :
      null;
  const classes = isStylingContext(tNode.classes) ?
      new NodeStylingDebug(tNode.classes as any as TStylingContext, tNode, lView, true) :
      null;
  return {
    html: toHtml(native),
    native: native as any, styles, classes,
    nodes: toDebugNodes(tNode.child, lView),
    component: componentLViewDebug,
  };
}

export class LContainerDebug {
  constructor(private readonly _raw_lContainer: LContainer) {}

  get activeIndex(): number { return getLContainerActiveIndex(this._raw_lContainer); }
  get hasTransplantedViews(): boolean {
    return (this._raw_lContainer[ACTIVE_INDEX] & ActiveIndexFlag.HAS_TRANSPLANTED_VIEWS) ===
        ActiveIndexFlag.HAS_TRANSPLANTED_VIEWS;
  }
  get views(): LViewDebug[] {
    return this._raw_lContainer.slice(CONTAINER_HEADER_OFFSET)
        .map(toDebug as(l: LView) => LViewDebug);
  }
  get parent(): LViewDebug|LContainerDebug|null { return toDebug(this._raw_lContainer[PARENT]); }
  get movedViews(): LView[]|null { return this._raw_lContainer[MOVED_VIEWS]; }
  get host(): RElement|RComment|LView { return this._raw_lContainer[HOST]; }
  get native(): RComment { return this._raw_lContainer[NATIVE]; }
  get next() { return toDebug(this._raw_lContainer[NEXT]); }
}

/**
 * Return an `LView` value if found.
 *
 * @param value `LView` if any
 */
export function readLViewValue(value: any): LView|null {
  while (Array.isArray(value)) {
    // This check is not quite right, as it does not take into account `StylingContext`
    // This is why it is in debug, not in util.ts
    if (value.length >= HEADER_OFFSET - 1) return value as LView;
    value = value[HOST];
  }
  return null;
}

export class I18NDebugItem {
  [key: string]: any;

  get tNode() { return getTNode(this.nodeIndex, this._lView); }

  constructor(
      public __raw_opCode: any, private _lView: LView, public nodeIndex: number,
      public type: string) {}
}

/**
 * Turns a list of "Create" & "Update" OpCodes into a human-readable list of operations for
 * debugging purposes.
 * @param mutateOpCodes mutation opCodes to read
 * @param updateOpCodes update opCodes to read
 * @param icus list of ICU expressions
 * @param lView The view the opCodes are acting on
 */
export function attachI18nOpCodesDebug(
    mutateOpCodes: I18nMutateOpCodes, updateOpCodes: I18nUpdateOpCodes, icus: TIcu[] | null,
    lView: LView) {
  attachDebugObject(mutateOpCodes, new I18nMutateOpCodesDebug(mutateOpCodes, lView));
  attachDebugObject(updateOpCodes, new I18nUpdateOpCodesDebug(updateOpCodes, icus, lView));

  if (icus) {
    icus.forEach(icu => {
      icu.create.forEach(
          icuCase => { attachDebugObject(icuCase, new I18nMutateOpCodesDebug(icuCase, lView)); });
      icu.update.forEach(icuCase => {
        attachDebugObject(icuCase, new I18nUpdateOpCodesDebug(icuCase, icus, lView));
      });
    });
  }
}

export class I18nMutateOpCodesDebug implements I18nOpCodesDebug {
  constructor(private readonly __raw_opCodes: I18nMutateOpCodes, private readonly __lView: LView) {}

  /**
   * A list of operation information about how the OpCodes will act on the view.
   */
  get operations() {
    const {__lView, __raw_opCodes} = this;
    const results: any[] = [];

    for (let i = 0; i < __raw_opCodes.length; i++) {
      const opCode = __raw_opCodes[i];
      let result: any;
      if (typeof opCode === 'string') {
        result = {
          __raw_opCode: opCode,
          type: 'Create Text Node',
          nodeIndex: __raw_opCodes[++i],
          text: opCode,
        };
      }

      if (typeof opCode === 'number') {
        switch (opCode & I18nMutateOpCode.MASK_OPCODE) {
          case I18nMutateOpCode.AppendChild:
            const destinationNodeIndex = opCode >>> I18nMutateOpCode.SHIFT_PARENT;
            result = new I18NDebugItem(opCode, __lView, destinationNodeIndex, 'AppendChild');
            break;
          case I18nMutateOpCode.Select:
            const nodeIndex = opCode >>> I18nMutateOpCode.SHIFT_REF;
            result = new I18NDebugItem(opCode, __lView, nodeIndex, 'Select');
            break;
          case I18nMutateOpCode.ElementEnd:
            let elementIndex = opCode >>> I18nMutateOpCode.SHIFT_REF;
            result = new I18NDebugItem(opCode, __lView, elementIndex, 'ElementEnd');
            break;
          case I18nMutateOpCode.Attr:
            elementIndex = opCode >>> I18nMutateOpCode.SHIFT_REF;
            result = new I18NDebugItem(opCode, __lView, elementIndex, 'Attr');
            result['attrName'] = __raw_opCodes[++i];
            result['attrValue'] = __raw_opCodes[++i];
            break;
        }
      }

      if (!result) {
        switch (opCode) {
          case COMMENT_MARKER:
            result = {
              __raw_opCode: opCode,
              type: 'COMMENT_MARKER',
              commentValue: __raw_opCodes[++i],
              nodeIndex: __raw_opCodes[++i],
            };
            break;
          case ELEMENT_MARKER:
            result = {
              __raw_opCode: opCode,
              type: 'ELEMENT_MARKER',
            };
            break;
        }
      }

      if (!result) {
        result = {
          __raw_opCode: opCode,
          type: 'Unknown Op Code',
          code: opCode,
        };
      }

      results.push(result);
    }

    return results;
  }
}

export class I18nUpdateOpCodesDebug implements I18nOpCodesDebug {
  constructor(
      private readonly __raw_opCodes: I18nUpdateOpCodes, private readonly icus: TIcu[]|null,
      private readonly __lView: LView) {}

  /**
   * A list of operation information about how the OpCodes will act on the view.
   */
  get operations() {
    const {__lView, __raw_opCodes, icus} = this;
    const results: any[] = [];

    for (let i = 0; i < __raw_opCodes.length; i++) {
      // bit code to check if we should apply the next update
      const checkBit = __raw_opCodes[i] as number;
      // Number of opCodes to skip until next set of update codes
      const skipCodes = __raw_opCodes[++i] as number;
      let value = '';
      for (let j = i + 1; j <= (i + skipCodes); j++) {
        const opCode = __raw_opCodes[j];
        if (typeof opCode === 'string') {
          value += opCode;
        } else if (typeof opCode == 'number') {
          if (opCode < 0) {
            // It's a binding index whose value is negative
            // We cannot know the value of the binding so we only show the index
            value += `�${-opCode - 1}�`;
          } else {
            const nodeIndex = opCode >>> I18nUpdateOpCode.SHIFT_REF;
            let tIcuIndex: number;
            let tIcu: TIcu;
            switch (opCode & I18nUpdateOpCode.MASK_OPCODE) {
              case I18nUpdateOpCode.Attr:
                const attrName = __raw_opCodes[++j] as string;
                const sanitizeFn = __raw_opCodes[++j];
                results.push({
                  __raw_opCode: opCode,
                  checkBit,
                  type: 'Attr',
                  attrValue: value, attrName, sanitizeFn,
                });
                break;
              case I18nUpdateOpCode.Text:
                results.push({
                  __raw_opCode: opCode,
                  checkBit,
                  type: 'Text', nodeIndex,
                  text: value,
                });
                break;
              case I18nUpdateOpCode.IcuSwitch:
                tIcuIndex = __raw_opCodes[++j] as number;
                tIcu = icus ![tIcuIndex];
                let result = new I18NDebugItem(opCode, __lView, nodeIndex, 'IcuSwitch');
                result['tIcuIndex'] = tIcuIndex;
                result['checkBit'] = checkBit;
                result['mainBinding'] = value;
                result['tIcu'] = tIcu;
                results.push(result);
                break;
              case I18nUpdateOpCode.IcuUpdate:
                tIcuIndex = __raw_opCodes[++j] as number;
                tIcu = icus ![tIcuIndex];
                result = new I18NDebugItem(opCode, __lView, nodeIndex, 'IcuUpdate');
                result['tIcuIndex'] = tIcuIndex;
                result['checkBit'] = checkBit;
                result['tIcu'] = tIcu;
                results.push(result);
                break;
            }
          }
        }
      }
      i += skipCodes;
    }
    return results;
  }
}

export interface I18nOpCodesDebug { operations: any[]; }
