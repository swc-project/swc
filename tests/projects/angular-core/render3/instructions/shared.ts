/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Injector} from '../../di';
import {ErrorHandler} from '../../error_handler';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, SchemaMetadata} from '../../metadata/schema';
import {ViewEncapsulation} from '../../metadata/view';
import {validateAgainstEventAttributes, validateAgainstEventProperties} from '../../sanitization/sanitization';
import {Sanitizer} from '../../sanitization/sanitizer';
import {assertDataInRange, assertDefined, assertDomNode, assertEqual, assertGreaterThan, assertNotEqual, assertNotSame} from '../../util/assert';
import {createNamedArrayType} from '../../util/named_array_type';
import {initNgDevMode} from '../../util/ng_dev_mode';
import {normalizeDebugBindingName, normalizeDebugBindingValue} from '../../util/ng_reflect';
import {assertFirstCreatePass, assertLContainer, assertLView} from '../assert';
import {attachPatchData} from '../context_discovery';
import {getFactoryDef} from '../definition';
import {diPublicInInjector, getNodeInjectable, getOrCreateNodeInjectorForNode} from '../di';
import {throwMultipleComponentError} from '../errors';
import {executeCheckHooks, executeInitAndCheckHooks, incrementInitPhaseFlags, registerPreOrderHooks} from '../hooks';
import {ACTIVE_INDEX, ActiveIndexFlag, CONTAINER_HEADER_OFFSET, LContainer, MOVED_VIEWS} from '../interfaces/container';
import {ComponentDef, ComponentTemplate, DirectiveDef, DirectiveDefListOrFactory, PipeDefListOrFactory, RenderFlags, ViewQueriesFunction} from '../interfaces/definition';
import {INJECTOR_BLOOM_PARENT_SIZE, NodeInjectorFactory} from '../interfaces/injector';
import {AttributeMarker, InitialInputData, InitialInputs, LocalRefExtractor, PropertyAliasValue, PropertyAliases, TAttributes, TConstants, TContainerNode, TDirectiveHostNode, TElementContainerNode, TElementNode, TIcuContainerNode, TNode, TNodeFlags, TNodeProviderIndexes, TNodeType, TProjectionNode, TViewNode} from '../interfaces/node';
import {RComment, RElement, RNode, RText, Renderer3, RendererFactory3, isProceduralRenderer} from '../interfaces/renderer';
import {SanitizerFn} from '../interfaces/sanitization';
import {isComponentDef, isComponentHost, isContentQueryHost, isLContainer, isRootView} from '../interfaces/type_checks';
import {CHILD_HEAD, CHILD_TAIL, CLEANUP, CONTEXT, DECLARATION_COMPONENT_VIEW, DECLARATION_VIEW, ExpandoInstructions, FLAGS, HEADER_OFFSET, HOST, INJECTOR, InitPhaseState, LView, LViewFlags, NEXT, PARENT, RENDERER, RENDERER_FACTORY, RootContext, RootContextFlags, SANITIZER, TData, TVIEW, TView, TViewType, T_HOST} from '../interfaces/view';
import {assertNodeOfPossibleTypes} from '../node_assert';
import {isNodeMatchingSelectorList} from '../node_selector_matcher';
import {ActiveElementFlags, enterView, executeElementExitFn, getBindingsEnabled, getCheckNoChangesMode, getIsParent, getPreviousOrParentTNode, getSelectedIndex, hasActiveElementFlag, incrementActiveDirectiveId, leaveView, leaveViewProcessExit, setActiveHostElement, setBindingIndex, setBindingRoot, setCheckNoChangesMode, setCurrentDirectiveDef, setCurrentQueryIndex, setPreviousOrParentTNode, setSelectedIndex} from '../state';
import {renderStylingMap, writeStylingValueDirectly} from '../styling/bindings';
import {NO_CHANGE} from '../tokens';
import {isAnimationProp} from '../util/attrs_utils';
import {INTERPOLATION_DELIMITER, renderStringify, stringifyForError} from '../util/misc_utils';
import {getInitialStylingValue} from '../util/styling_utils';
import {getLViewParent} from '../util/view_traversal_utils';
import {getComponentLViewByIndex, getNativeByIndex, getNativeByTNode, getTNode, isCreationMode, readPatchedLView, resetPreOrderHookFlags, unwrapRNode, viewAttachedToChangeDetector} from '../util/view_utils';

import {selectIndexInternal} from './advance';
import {LCleanup, LViewBlueprint, MatchesArray, TCleanup, TNodeConstructor, TNodeInitialInputs, TNodeLocalNames, TViewComponents, TViewConstructor, attachLContainerDebug, attachLViewDebug, cloneToLViewFromTViewBlueprint, cloneToTViewData} from './lview_debug';



/**
 * A permanent marker promise which signifies that the current CD tree is
 * clean.
 */
const _CLEAN_PROMISE = (() => Promise.resolve(null))();

/** Sets the host bindings for the current view. */
export function setHostBindings(tView: TView, lView: LView): void {
  const selectedIndex = getSelectedIndex();
  try {
    if (tView.expandoInstructions !== null) {
      let bindingRootIndex = setBindingIndex(tView.expandoStartIndex);
      setBindingRoot(bindingRootIndex);
      let currentDirectiveIndex = -1;
      let currentElementIndex = -1;
      for (let i = 0; i < tView.expandoInstructions.length; i++) {
        const instruction = tView.expandoInstructions[i];
        if (typeof instruction === 'number') {
          if (instruction <= 0) {
            // Negative numbers mean that we are starting new EXPANDO block and need to update
            // the current element and directive index.
            currentElementIndex = -instruction;
            setActiveHostElement(currentElementIndex);

            // Injector block and providers are taken into account.
            const providerCount = (tView.expandoInstructions[++i] as number);
            bindingRootIndex += INJECTOR_BLOOM_PARENT_SIZE + providerCount;

            currentDirectiveIndex = bindingRootIndex;
          } else {
            // This is either the injector size (so the binding root can skip over directives
            // and get to the first set of host bindings on this node) or the host var count
            // (to get to the next set of host bindings on this node).
            bindingRootIndex += instruction;
          }
          setBindingRoot(bindingRootIndex);
        } else {
          // If it's not a number, it's a host binding function that needs to be executed.
          if (instruction !== null) {
            // Each directive gets a uniqueId value that is the same for both
            // create and update calls when the hostBindings function is called. The
            // directive uniqueId is not set anywhere--it is just incremented between
            // each hostBindings call and is useful for helping instruction code
            // uniquely determine which directive is currently active when executed.
            // It is important that this be called first before the actual instructions
            // are run because this way the first directive ID value is not zero.
            incrementActiveDirectiveId();

            setBindingIndex(bindingRootIndex);
            const hostCtx = unwrapRNode(lView[currentDirectiveIndex]);
            instruction(RenderFlags.Update, hostCtx, currentElementIndex);
          }
          currentDirectiveIndex++;
        }
      }
    }
  } finally {
    setActiveHostElement(selectedIndex);
  }
}

/** Refreshes all content queries declared by directives in a given view */
function refreshContentQueries(tView: TView, lView: LView): void {
  const contentQueries = tView.contentQueries;
  if (contentQueries !== null) {
    for (let i = 0; i < contentQueries.length; i += 2) {
      const queryStartIdx = contentQueries[i];
      const directiveDefIdx = contentQueries[i + 1];
      if (directiveDefIdx !== -1) {
        const directiveDef = tView.data[directiveDefIdx] as DirectiveDef<any>;
        ngDevMode &&
            assertDefined(directiveDef.contentQueries, 'contentQueries function should be defined');
        setCurrentQueryIndex(queryStartIdx);
        directiveDef.contentQueries !(RenderFlags.Update, lView[directiveDefIdx], directiveDefIdx);
      }
    }
  }
}

/** Refreshes child components in the current view (update mode). */
function refreshChildComponents(hostLView: LView, components: number[]): void {
  for (let i = 0; i < components.length; i++) {
    refreshComponent(hostLView, components[i]);
  }
}

/** Renders child components in the current view (creation mode). */
function renderChildComponents(hostLView: LView, components: number[]): void {
  for (let i = 0; i < components.length; i++) {
    renderComponent(hostLView, components[i]);
  }
}

/**
 * Creates a native element from a tag name, using a renderer.
 * @param name the tag name
 * @param renderer A renderer to use
 * @returns the element created
 */
export function elementCreate(
    name: string, renderer: Renderer3, namespace: string | null): RElement {
  if (isProceduralRenderer(renderer)) {
    return renderer.createElement(name, namespace);
  } else {
    return namespace === null ? renderer.createElement(name) :
                                renderer.createElementNS(namespace, name);
  }
}

export function createLView<T>(
    parentLView: LView | null, tView: TView, context: T | null, flags: LViewFlags,
    host: RElement | null, tHostNode: TViewNode | TElementNode | null,
    rendererFactory?: RendererFactory3 | null, renderer?: Renderer3 | null,
    sanitizer?: Sanitizer | null, injector?: Injector | null): LView {
  const lView =
      ngDevMode ? cloneToLViewFromTViewBlueprint(tView) : tView.blueprint.slice() as LView;
  lView[HOST] = host;
  lView[FLAGS] = flags | LViewFlags.CreationMode | LViewFlags.Attached | LViewFlags.FirstLViewPass;
  resetPreOrderHookFlags(lView);
  lView[PARENT] = lView[DECLARATION_VIEW] = parentLView;
  lView[CONTEXT] = context;
  lView[RENDERER_FACTORY] = (rendererFactory || parentLView && parentLView[RENDERER_FACTORY]) !;
  ngDevMode && assertDefined(lView[RENDERER_FACTORY], 'RendererFactory is required');
  lView[RENDERER] = (renderer || parentLView && parentLView[RENDERER]) !;
  ngDevMode && assertDefined(lView[RENDERER], 'Renderer is required');
  lView[SANITIZER] = sanitizer || parentLView && parentLView[SANITIZER] || null !;
  lView[INJECTOR as any] = injector || parentLView && parentLView[INJECTOR] || null;
  lView[T_HOST] = tHostNode;
  ngDevMode && assertEqual(
                   tView.type == TViewType.Embedded ? parentLView !== null : true, true,
                   'Embedded views must have parentLView');
  lView[DECLARATION_COMPONENT_VIEW] =
      tView.type == TViewType.Embedded ? parentLView ![DECLARATION_COMPONENT_VIEW] : lView;
  ngDevMode && attachLViewDebug(lView);
  return lView;
}

/**
 * Create and stores the TNode, and hooks it up to the tree.
 *
 * @param tView The current `TView`.
 * @param tHostNode This is a hack and we should not have to pass this value in. It is only used to
 * determine if the parent belongs to a different tView. Instead we should not have parentTView
 * point to TView other the current one.
 * @param index The index at which the TNode should be saved (null if view, since they are not
 * saved).
 * @param type The type of TNode to create
 * @param native The native element for this node, if applicable
 * @param name The tag name of the associated native element, if applicable
 * @param attrs Any attrs for the native element, if applicable
 */
export function getOrCreateTNode(
    tView: TView, tHostNode: TNode | null, index: number, type: TNodeType.Element,
    name: string | null, attrs: TAttributes | null): TElementNode;
export function getOrCreateTNode(
    tView: TView, tHostNode: TNode | null, index: number, type: TNodeType.Container,
    name: string | null, attrs: TAttributes | null): TContainerNode;
export function getOrCreateTNode(
    tView: TView, tHostNode: TNode | null, index: number, type: TNodeType.Projection, name: null,
    attrs: TAttributes | null): TProjectionNode;
export function getOrCreateTNode(
    tView: TView, tHostNode: TNode | null, index: number, type: TNodeType.ElementContainer,
    name: string | null, attrs: TAttributes | null): TElementContainerNode;
export function getOrCreateTNode(
    tView: TView, tHostNode: TNode | null, index: number, type: TNodeType.IcuContainer, name: null,
    attrs: TAttributes | null): TElementContainerNode;
export function getOrCreateTNode(
    tView: TView, tHostNode: TNode | null, index: number, type: TNodeType, name: string | null,
    attrs: TAttributes | null): TElementNode&TContainerNode&TElementContainerNode&TProjectionNode&
    TIcuContainerNode {
  // Keep this function short, so that the VM will inline it.
  const adjustedIndex = index + HEADER_OFFSET;
  const tNode = tView.data[adjustedIndex] as TNode ||
      createTNodeAtIndex(tView, tHostNode, adjustedIndex, type, name, attrs);
  setPreviousOrParentTNode(tNode, true);
  return tNode as TElementNode & TViewNode & TContainerNode & TElementContainerNode &
      TProjectionNode & TIcuContainerNode;
}

function createTNodeAtIndex(
    tView: TView, tHostNode: TNode | null, adjustedIndex: number, type: TNodeType,
    name: string | null, attrs: TAttributes | null) {
  const previousOrParentTNode = getPreviousOrParentTNode();
  const isParent = getIsParent();
  const parent =
      isParent ? previousOrParentTNode : previousOrParentTNode && previousOrParentTNode.parent;
  // Parents cannot cross component boundaries because components will be used in multiple places,
  // so it's only set if the view is the same.
  const parentInSameView = parent && parent !== tHostNode;
  const tParentNode = parentInSameView ? parent as TElementNode | TContainerNode : null;
  const tNode = tView.data[adjustedIndex] =
      createTNode(tView, tParentNode, type, adjustedIndex, name, attrs);
  // Assign a pointer to the first child node of a given view. The first node is not always the one
  // at index 0, in case of i18n, index 0 can be the instruction `i18nStart` and the first node has
  // the index 1 or more, so we can't just check node index.
  if (tView.firstChild === null) {
    tView.firstChild = tNode;
  }
  if (previousOrParentTNode) {
    if (isParent && previousOrParentTNode.child == null &&
        (tNode.parent !== null || previousOrParentTNode.type === TNodeType.View)) {
      // We are in the same view, which means we are adding content node to the parent view.
      previousOrParentTNode.child = tNode;
    } else if (!isParent) {
      previousOrParentTNode.next = tNode;
    }
  }
  return tNode;
}

export function assignTViewNodeToLView(
    tView: TView, tParentNode: TNode | null, index: number, lView: LView): TViewNode {
  // View nodes are not stored in data because they can be added / removed at runtime (which
  // would cause indices to change). Their TNodes are instead stored in tView.node.
  let tNode = tView.node;
  if (tNode == null) {
    ngDevMode && tParentNode &&
        assertNodeOfPossibleTypes(tParentNode, TNodeType.Element, TNodeType.Container);
    tView.node = tNode = createTNode(
        tView,
        tParentNode as TElementNode | TContainerNode | null,  //
        TNodeType.View, index, null, null) as TViewNode;
  }

  return lView[T_HOST] = tNode as TViewNode;
}


/**
 * When elements are created dynamically after a view blueprint is created (e.g. through
 * i18nApply() or ComponentFactory.create), we need to adjust the blueprint for future
 * template passes.
 *
 * @param view The LView containing the blueprint to adjust
 * @param numSlotsToAlloc The number of slots to alloc in the LView, should be >0
 */
export function allocExpando(view: LView, numSlotsToAlloc: number) {
  ngDevMode && assertGreaterThan(
                   numSlotsToAlloc, 0, 'The number of slots to alloc should be greater than 0');
  if (numSlotsToAlloc > 0) {
    const tView = view[TVIEW];
    if (tView.firstCreatePass) {
      for (let i = 0; i < numSlotsToAlloc; i++) {
        tView.blueprint.push(null);
        tView.data.push(null);
        view.push(null);
      }

      // We should only increment the expando start index if there aren't already directives
      // and injectors saved in the "expando" section
      if (!tView.expandoInstructions) {
        tView.expandoStartIndex += numSlotsToAlloc;
      } else {
        // Since we're adding the dynamic nodes into the expando section, we need to let the host
        // bindings know that they should skip x slots
        tView.expandoInstructions.push(numSlotsToAlloc);
      }
    }
  }
}


//////////////////////////
//// Render
//////////////////////////

/**
 * Processes a view in the creation mode. This includes a number of steps in a specific order:
 * - creating view query functions (if any);
 * - executing a template function in the creation mode;
 * - updating static queries (if any);
 * - creating child components defined in a given view.
 */
export function renderView<T>(lView: LView, tView: TView, context: T): void {
  ngDevMode && assertEqual(isCreationMode(lView), true, 'Should be run in creation mode');
  enterView(lView, lView[T_HOST]);
  try {
    const viewQuery = tView.viewQuery;
    if (viewQuery !== null) {
      executeViewQueryFn(RenderFlags.Create, viewQuery, context);
    }

    // Execute a template associated with this view, if it exists. A template function might not be
    // defined for the root component views.
    const templateFn = tView.template;
    if (templateFn !== null) {
      executeTemplate(lView, templateFn, RenderFlags.Create, context);
    }

    // This needs to be set before children are processed to support recursive components.
    // This must be set to false immediately after the first creation run because in an
    // ngFor loop, all the views will be created together before update mode runs and turns
    // off firstCreatePass. If we don't set it here, instances will perform directive
    // matching, etc again and again.
    if (tView.firstCreatePass) {
      tView.firstCreatePass = false;
    }

    // We resolve content queries specifically marked as `static` in creation mode. Dynamic
    // content queries are resolved during change detection (i.e. update mode), after embedded
    // views are refreshed (see block above).
    if (tView.staticContentQueries) {
      refreshContentQueries(tView, lView);
    }

    // We must materialize query results before child components are processed
    // in case a child component has projected a container. The LContainer needs
    // to exist so the embedded views are properly attached by the container.
    if (tView.staticViewQueries) {
      executeViewQueryFn(RenderFlags.Update, tView.viewQuery !, context);
    }

    // Render child component views.
    const components = tView.components;
    if (components !== null) {
      renderChildComponents(lView, components);
    }

  } finally {
    lView[FLAGS] &= ~LViewFlags.CreationMode;
    leaveView();
  }
}

/**
 * Processes a view in update mode. This includes a number of steps in a specific order:
 * - executing a template function in update mode;
 * - executing hooks;
 * - refreshing queries;
 * - setting host bindings;
 * - refreshing child (embedded and component) views.
 */
export function refreshView<T>(
    lView: LView, tView: TView, templateFn: ComponentTemplate<{}>| null, context: T) {
  ngDevMode && assertEqual(isCreationMode(lView), false, 'Should be run in update mode');
  enterView(lView, lView[T_HOST]);
  const flags = lView[FLAGS];
  try {
    resetPreOrderHookFlags(lView);

    setBindingIndex(tView.bindingStartIndex);
    if (templateFn !== null) {
      executeTemplate(lView, templateFn, RenderFlags.Update, context);
    }

    const checkNoChangesMode = getCheckNoChangesMode();
    const hooksInitPhaseCompleted =
        (flags & LViewFlags.InitPhaseStateMask) === InitPhaseState.InitPhaseCompleted;

    // execute pre-order hooks (OnInit, OnChanges, DoChanges)
    // PERF WARNING: do NOT extract this to a separate function without running benchmarks
    if (!checkNoChangesMode) {
      if (hooksInitPhaseCompleted) {
        const preOrderCheckHooks = tView.preOrderCheckHooks;
        if (preOrderCheckHooks !== null) {
          executeCheckHooks(lView, preOrderCheckHooks, null);
        }
      } else {
        const preOrderHooks = tView.preOrderHooks;
        if (preOrderHooks !== null) {
          executeInitAndCheckHooks(lView, preOrderHooks, InitPhaseState.OnInitHooksToBeRun, null);
        }
        incrementInitPhaseFlags(lView, InitPhaseState.OnInitHooksToBeRun);
      }
    }

    refreshDynamicEmbeddedViews(lView);

    // Content query results must be refreshed before content hooks are called.
    if (tView.contentQueries !== null) {
      refreshContentQueries(tView, lView);
    }

    // execute content hooks (AfterContentInit, AfterContentChecked)
    // PERF WARNING: do NOT extract this to a separate function without running benchmarks
    if (!checkNoChangesMode) {
      if (hooksInitPhaseCompleted) {
        const contentCheckHooks = tView.contentCheckHooks;
        if (contentCheckHooks !== null) {
          executeCheckHooks(lView, contentCheckHooks);
        }
      } else {
        const contentHooks = tView.contentHooks;
        if (contentHooks !== null) {
          executeInitAndCheckHooks(
              lView, contentHooks, InitPhaseState.AfterContentInitHooksToBeRun);
        }
        incrementInitPhaseFlags(lView, InitPhaseState.AfterContentInitHooksToBeRun);
      }
    }

    setHostBindings(tView, lView);

    // Refresh child component views.
    const components = tView.components;
    if (components !== null) {
      refreshChildComponents(lView, components);
    }

    // View queries must execute after refreshing child components because a template in this view
    // could be inserted in a child component. If the view query executes before child component
    // refresh, the template might not yet be inserted.
    const viewQuery = tView.viewQuery;
    if (viewQuery !== null) {
      executeViewQueryFn(RenderFlags.Update, viewQuery, context);
    }

    // execute view hooks (AfterViewInit, AfterViewChecked)
    // PERF WARNING: do NOT extract this to a separate function without running benchmarks
    if (!checkNoChangesMode) {
      if (hooksInitPhaseCompleted) {
        const viewCheckHooks = tView.viewCheckHooks;
        if (viewCheckHooks !== null) {
          executeCheckHooks(lView, viewCheckHooks);
        }
      } else {
        const viewHooks = tView.viewHooks;
        if (viewHooks !== null) {
          executeInitAndCheckHooks(lView, viewHooks, InitPhaseState.AfterViewInitHooksToBeRun);
        }
        incrementInitPhaseFlags(lView, InitPhaseState.AfterViewInitHooksToBeRun);
      }
    }

  } finally {
    if (tView.firstUpdatePass === true) {
      tView.firstUpdatePass = false;
    }
    lView[FLAGS] &= ~(LViewFlags.Dirty | LViewFlags.FirstLViewPass);
    leaveViewProcessExit();
  }
}

export function renderComponentOrTemplate<T>(
    hostView: LView, templateFn: ComponentTemplate<{}>| null, context: T) {
  const rendererFactory = hostView[RENDERER_FACTORY];
  const normalExecutionPath = !getCheckNoChangesMode();
  const creationModeIsActive = isCreationMode(hostView);
  try {
    if (normalExecutionPath && !creationModeIsActive && rendererFactory.begin) {
      rendererFactory.begin();
    }
    const tView = hostView[TVIEW];
    if (creationModeIsActive) {
      renderView(hostView, tView, context);
    }
    refreshView(hostView, tView, templateFn, context);
  } finally {
    if (normalExecutionPath && !creationModeIsActive && rendererFactory.end) {
      rendererFactory.end();
    }
  }
}

function executeTemplate<T>(
    lView: LView, templateFn: ComponentTemplate<T>, rf: RenderFlags, context: T) {
  const prevSelectedIndex = getSelectedIndex();
  try {
    setActiveHostElement(null);
    if (rf & RenderFlags.Update && lView.length > HEADER_OFFSET) {
      // When we're updating, inherently select 0 so we don't
      // have to generate that instruction for most update blocks.
      selectIndexInternal(lView, 0, getCheckNoChangesMode());
    }
    templateFn(rf, context);
  } finally {
    if (hasActiveElementFlag(ActiveElementFlags.RunExitFn)) {
      executeElementExitFn();
    }
    setSelectedIndex(prevSelectedIndex);
  }
}

//////////////////////////
//// Element
//////////////////////////

export function executeContentQueries(tView: TView, tNode: TNode, lView: LView) {
  if (isContentQueryHost(tNode)) {
    const start = tNode.directiveStart;
    const end = tNode.directiveEnd;
    for (let directiveIndex = start; directiveIndex < end; directiveIndex++) {
      const def = tView.data[directiveIndex] as DirectiveDef<any>;
      if (def.contentQueries) {
        def.contentQueries(RenderFlags.Create, lView[directiveIndex], directiveIndex);
      }
    }
  }
}


/**
 * Creates directive instances.
 */
export function createDirectivesInstances(tView: TView, lView: LView, tNode: TDirectiveHostNode) {
  if (!getBindingsEnabled()) return;
  instantiateAllDirectives(tView, lView, tNode, getNativeByTNode(tNode, lView));
  if ((tNode.flags & TNodeFlags.hasHostBindings) === TNodeFlags.hasHostBindings) {
    invokeDirectivesHostBindings(tView, lView, tNode);
  }
}

/**
 * Takes a list of local names and indices and pushes the resolved local variable values
 * to LView in the same order as they are loaded in the template with load().
 */
export function saveResolvedLocalsInData(
    viewData: LView, tNode: TDirectiveHostNode,
    localRefExtractor: LocalRefExtractor = getNativeByTNode): void {
  const localNames = tNode.localNames;
  if (localNames !== null) {
    let localIndex = tNode.index + 1;
    for (let i = 0; i < localNames.length; i += 2) {
      const index = localNames[i + 1] as number;
      const value = index === -1 ?
          localRefExtractor(
              tNode as TElementNode | TContainerNode | TElementContainerNode, viewData) :
          viewData[index];
      viewData[localIndex++] = value;
    }
  }
}

/**
 * Gets TView from a template function or creates a new TView
 * if it doesn't already exist.
 *
 * @param def ComponentDef
 * @returns TView
 */
export function getOrCreateTComponentView(def: ComponentDef<any>): TView {
  return def.tView ||
      (def.tView = createTView(
           TViewType.Component, -1, def.template, def.decls, def.vars, def.directiveDefs,
           def.pipeDefs, def.viewQuery, def.schemas, def.consts));
}


/**
 * Creates a TView instance
 *
 * @param viewIndex The viewBlockId for inline views, or -1 if it's a component/dynamic
 * @param templateFn Template function
 * @param decls The number of nodes, local refs, and pipes in this template
 * @param directives Registry of directives for this view
 * @param pipes Registry of pipes for this view
 * @param viewQuery View queries for this view
 * @param schemas Schemas for this view
 * @param consts Constants for this view
 */
export function createTView(
    type: TViewType, viewIndex: number, templateFn: ComponentTemplate<any>| null, decls: number,
    vars: number, directives: DirectiveDefListOrFactory | null, pipes: PipeDefListOrFactory | null,
    viewQuery: ViewQueriesFunction<any>| null, schemas: SchemaMetadata[] | null,
    consts: TConstants | null): TView {
  ngDevMode && ngDevMode.tView++;
  const bindingStartIndex = HEADER_OFFSET + decls;
  // This length does not yet contain host bindings from child directives because at this point,
  // we don't know which directives are active on this template. As soon as a directive is matched
  // that has a host binding, we will update the blueprint with that def's hostVars count.
  const initialViewLength = bindingStartIndex + vars;
  const blueprint = createViewBlueprint(bindingStartIndex, initialViewLength);
  return blueprint[TVIEW as any] = ngDevMode ?
      new TViewConstructor(
             type,
             viewIndex,   // id: number,
             blueprint,   // blueprint: LView,
             templateFn,  // template: ComponentTemplate<{}>|null,
             null,        // queries: TQueries|null
             viewQuery,   // viewQuery: ViewQueriesFunction<{}>|null,
             null !,      // node: TViewNode|TElementNode|null,
             cloneToTViewData(blueprint).fill(null, bindingStartIndex),  // data: TData,
             bindingStartIndex,  // bindingStartIndex: number,
             initialViewLength,  // expandoStartIndex: number,
             null,               // expandoInstructions: ExpandoInstructions|null,
             true,               // firstCreatePass: boolean,
             true,               // firstUpdatePass: boolean,
             false,              // staticViewQueries: boolean,
             false,              // staticContentQueries: boolean,
             null,               // preOrderHooks: HookData|null,
             null,               // preOrderCheckHooks: HookData|null,
             null,               // contentHooks: HookData|null,
             null,               // contentCheckHooks: HookData|null,
             null,               // viewHooks: HookData|null,
             null,               // viewCheckHooks: HookData|null,
             null,               // destroyHooks: HookData|null,
             null,               // cleanup: any[]|null,
             null,               // contentQueries: number[]|null,
             null,               // components: number[]|null,
             typeof directives === 'function' ?
                 directives() :
                 directives,  // directiveRegistry: DirectiveDefList|null,
             typeof pipes === 'function' ? pipes() : pipes,  // pipeRegistry: PipeDefList|null,
             null,                                           // firstChild: TNode|null,
             schemas,                                        // schemas: SchemaMetadata[]|null,
             consts) :                                       // consts: TConstants|null
      {
        type: type,
        id: viewIndex,
        blueprint: blueprint,
        template: templateFn,
        queries: null,
        viewQuery: viewQuery,
        node: null !,
        data: blueprint.slice().fill(null, bindingStartIndex),
        bindingStartIndex: bindingStartIndex,
        expandoStartIndex: initialViewLength,
        expandoInstructions: null,
        firstCreatePass: true,
        firstUpdatePass: true,
        staticViewQueries: false,
        staticContentQueries: false,
        preOrderHooks: null,
        preOrderCheckHooks: null,
        contentHooks: null,
        contentCheckHooks: null,
        viewHooks: null,
        viewCheckHooks: null,
        destroyHooks: null,
        cleanup: null,
        contentQueries: null,
        components: null,
        directiveRegistry: typeof directives === 'function' ? directives() : directives,
        pipeRegistry: typeof pipes === 'function' ? pipes() : pipes,
        firstChild: null,
        schemas: schemas,
        consts: consts,
      };
}

function createViewBlueprint(bindingStartIndex: number, initialViewLength: number): LView {
  const blueprint = ngDevMode ? new LViewBlueprint() : [];

  for (let i = 0; i < initialViewLength; i++) {
    blueprint.push(i < bindingStartIndex ? null : NO_CHANGE);
  }

  return blueprint as LView;
}

function createError(text: string, token: any) {
  return new Error(`Renderer: ${text} [${stringifyForError(token)}]`);
}

function assertHostNodeExists(rElement: RElement, elementOrSelector: RElement | string) {
  if (!rElement) {
    if (typeof elementOrSelector === 'string') {
      throw createError('Host node with selector not found:', elementOrSelector);
    } else {
      throw createError('Host node is required:', elementOrSelector);
    }
  }
}

/**
 * Locates the host native element, used for bootstrapping existing nodes into rendering pipeline.
 *
 * @param rendererFactory Factory function to create renderer instance.
 * @param elementOrSelector Render element or CSS selector to locate the element.
 * @param encapsulation View Encapsulation defined for component that requests host element.
 */
export function locateHostElement(
    rendererFactory: RendererFactory3, elementOrSelector: RElement | string,
    encapsulation: ViewEncapsulation): RElement {
  const renderer = rendererFactory.createRenderer(null, null);

  if (isProceduralRenderer(renderer)) {
    // When using native Shadow DOM, do not clear host element to allow native slot projection
    const preserveContent = encapsulation === ViewEncapsulation.ShadowDom;
    return renderer.selectRootElement(elementOrSelector, preserveContent);
  }

  let rElement = typeof elementOrSelector === 'string' ?
      renderer.querySelector(elementOrSelector) ! :
      elementOrSelector;
  ngDevMode && assertHostNodeExists(rElement, elementOrSelector);

  // Always clear host element's content when Renderer3 is in use. For procedural renderer case we
  // make it depend on whether ShadowDom encapsulation is used (in which case the content should be
  // preserved to allow native slot projection). ShadowDom encapsulation requires procedural
  // renderer, and procedural renderer case is handled above.
  rElement.textContent = '';

  return rElement;
}

/**
 * Saves context for this cleanup function in LView.cleanupInstances.
 *
 * On the first template pass, saves in TView:
 * - Cleanup function
 * - Index of context we just saved in LView.cleanupInstances
 */
export function storeCleanupWithContext(lView: LView, context: any, cleanupFn: Function): void {
  const lCleanup = getCleanup(lView);
  lCleanup.push(context);

  if (lView[TVIEW].firstCreatePass) {
    getTViewCleanup(lView).push(cleanupFn, lCleanup.length - 1);
  }
}

/**
 * Saves the cleanup function itself in LView.cleanupInstances.
 *
 * This is necessary for functions that are wrapped with their contexts, like in renderer2
 * listeners.
 *
 * On the first template pass, the index of the cleanup function is saved in TView.
 */
export function storeCleanupFn(view: LView, cleanupFn: Function): void {
  getCleanup(view).push(cleanupFn);

  if (view[TVIEW].firstCreatePass) {
    getTViewCleanup(view).push(view[CLEANUP] !.length - 1, null);
  }
}

// TODO: Remove this when the issue is resolved.
/**
 * Tsickle has a bug where it creates an infinite loop for a function returning itself.
 * This is a temporary type that will be removed when the issue is resolved.
 * https://github.com/angular/tsickle/issues/1009)
 */
export type TsickleIssue1009 = any;

/**
 * Constructs a TNode object from the arguments.
 *
 * @param tView `TView` to which this `TNode` belongs (used only in `ngDevMode`)
 * @param type The type of the node
 * @param adjustedIndex The index of the TNode in TView.data, adjusted for HEADER_OFFSET
 * @param tagName The tag name of the node
 * @param attrs The attributes defined on this node
 * @param tViews Any TViews attached to this node
 * @returns the TNode object
 */
export function createTNode(
    tView: TView, tParent: TElementNode | TContainerNode | null, type: TNodeType,
    adjustedIndex: number, tagName: string | null, attrs: TAttributes | null): TNode {
  ngDevMode && ngDevMode.tNode++;
  let injectorIndex = tParent ? tParent.injectorIndex : -1;
  return ngDevMode ? new TNodeConstructor(
                         tView,          // tView_: TView
                         type,           // type: TNodeType
                         adjustedIndex,  // index: number
                         injectorIndex,  // injectorIndex: number
                         -1,             // directiveStart: number
                         -1,             // directiveEnd: number
                         null,           // propertyBindings: number[]|null
                         0,              // flags: TNodeFlags
                         0,              // providerIndexes: TNodeProviderIndexes
                         tagName,        // tagName: string|null
                         attrs,  // attrs: (string|AttributeMarker|(string|SelectorFlags)[])[]|null
                         null,   // localNames: (string|number)[]|null
                         undefined,  // initialInputs: (string[]|null)[]|null|undefined
                         null,       // inputs: PropertyAliases|null
                         null,       // outputs: PropertyAliases|null
                         null,       // tViews: ITView|ITView[]|null
                         null,       // next: ITNode|null
                         null,       // projectionNext: ITNode|null
                         null,       // child: ITNode|null
                         tParent,    // parent: TElementNode|TContainerNode|null
                         null,       // projection: number|(ITNode|RNode[])[]|null
                         null,       // styles: TStylingContext|null
                         null,       // classes: TStylingContext|null
                         ) :
                     {
                       type: type,
                       index: adjustedIndex,
                       injectorIndex: injectorIndex,
                       directiveStart: -1,
                       directiveEnd: -1,
                       propertyBindings: null,
                       flags: 0,
                       providerIndexes: 0,
                       tagName: tagName,
                       attrs: attrs,
                       localNames: null,
                       initialInputs: undefined,
                       inputs: null,
                       outputs: null,
                       tViews: null,
                       next: null,
                       projectionNext: null,
                       child: null,
                       parent: tParent,
                       projection: null,
                       styles: null,
                       classes: null,
                     };
}


function generatePropertyAliases(
    inputAliasMap: {[publicName: string]: string}, directiveDefIdx: number,
    propStore: PropertyAliases | null): PropertyAliases|null {
  for (let publicName in inputAliasMap) {
    if (inputAliasMap.hasOwnProperty(publicName)) {
      propStore = propStore === null ? {} : propStore;
      const internalName = inputAliasMap[publicName];

      if (propStore.hasOwnProperty(publicName)) {
        propStore[publicName].push(directiveDefIdx, internalName);
      } else {
        (propStore[publicName] = [directiveDefIdx, internalName]);
      }
    }
  }
  return propStore;
}

/**
 * Initializes data structures required to work with directive outputs and outputs.
 * Initialization is done for all directives matched on a given TNode.
 */
function initializeInputAndOutputAliases(tView: TView, tNode: TNode): void {
  ngDevMode && assertFirstCreatePass(tView);

  const start = tNode.directiveStart;
  const end = tNode.directiveEnd;
  const defs = tView.data;

  const tNodeAttrs = tNode.attrs;
  const inputsFromAttrs: InitialInputData = ngDevMode ? new TNodeInitialInputs() : [];
  let inputsStore: PropertyAliases|null = null;
  let outputsStore: PropertyAliases|null = null;
  for (let i = start; i < end; i++) {
    const directiveDef = defs[i] as DirectiveDef<any>;
    const directiveInputs = directiveDef.inputs;
    inputsFromAttrs.push(
        tNodeAttrs !== null ? generateInitialInputs(directiveInputs, tNodeAttrs) : null);
    inputsStore = generatePropertyAliases(directiveInputs, i, inputsStore);
    outputsStore = generatePropertyAliases(directiveDef.outputs, i, outputsStore);
  }

  if (inputsStore !== null) {
    if (inputsStore.hasOwnProperty('class') || inputsStore.hasOwnProperty('className')) {
      tNode.flags |= TNodeFlags.hasClassInput;
    }
    if (inputsStore.hasOwnProperty('style')) {
      tNode.flags |= TNodeFlags.hasStyleInput;
    }
  }

  tNode.initialInputs = inputsFromAttrs;
  tNode.inputs = inputsStore;
  tNode.outputs = outputsStore;
}

/**
 * Mapping between attributes names that don't correspond to their element property names.
 *
 * Performance note: this function is written as a series of if checks (instead of, say, a property
 * object lookup) for performance reasons - the series of `if` checks seems to be the fastest way of
 * mapping property names. Do NOT change without benchmarking.
 *
 * Note: this mapping has to be kept in sync with the equally named mapping in the template
 * type-checking machinery of ngtsc.
 */
function mapPropName(name: string): string {
  if (name === 'class') return 'className';
  if (name === 'for') return 'htmlFor';
  if (name === 'formaction') return 'formAction';
  if (name === 'innerHtml') return 'innerHTML';
  if (name === 'readonly') return 'readOnly';
  if (name === 'tabindex') return 'tabIndex';
  return name;
}

export function elementPropertyInternal<T>(
    lView: LView, index: number, propName: string, value: T, sanitizer?: SanitizerFn | null,
    nativeOnly?: boolean,
    loadRendererFn?: ((tNode: TNode, lView: LView) => Renderer3) | null): void {
  ngDevMode && assertNotSame(value, NO_CHANGE as any, 'Incoming value should never be NO_CHANGE.');
  const element = getNativeByIndex(index, lView) as RElement | RComment;
  const tNode = getTNode(index, lView);
  let inputData = tNode.inputs;
  let dataValue: PropertyAliasValue|undefined;
  if (!nativeOnly && inputData != null && (dataValue = inputData[propName])) {
    setInputsForProperty(lView, dataValue, propName, value);
    if (isComponentHost(tNode)) markDirtyIfOnPush(lView, index + HEADER_OFFSET);
    if (ngDevMode) {
      setNgReflectProperties(lView, element, tNode.type, dataValue, value);
    }
  } else if (tNode.type === TNodeType.Element) {
    propName = mapPropName(propName);

    if (ngDevMode) {
      validateAgainstEventProperties(propName);
      if (!validateProperty(lView, element, propName, tNode)) {
        // Return here since we only log warnings for unknown properties.
        warnAboutUnknownProperty(propName, tNode);
        return;
      }
      ngDevMode.rendererSetProperty++;
    }

    const renderer = loadRendererFn ? loadRendererFn(tNode, lView) : lView[RENDERER];
    // It is assumed that the sanitizer is only added when the compiler determines that the
    // property is risky, so sanitization can be done without further checks.
    value = sanitizer != null ? (sanitizer(value, tNode.tagName || '', propName) as any) : value;
    if (isProceduralRenderer(renderer)) {
      renderer.setProperty(element as RElement, propName, value);
    } else if (!isAnimationProp(propName)) {
      (element as RElement).setProperty ? (element as any).setProperty(propName, value) :
                                          (element as any)[propName] = value;
    }
  } else if (tNode.type === TNodeType.Container) {
    // If the node is a container and the property didn't
    // match any of the inputs or schemas we should throw.
    if (ngDevMode && !matchingSchemas(lView, tNode.tagName)) {
      warnAboutUnknownProperty(propName, tNode);
    }
  }
}

/** If node is an OnPush component, marks its LView dirty. */
function markDirtyIfOnPush(lView: LView, viewIndex: number): void {
  ngDevMode && assertLView(lView);
  const childComponentLView = getComponentLViewByIndex(viewIndex, lView);
  if (!(childComponentLView[FLAGS] & LViewFlags.CheckAlways)) {
    childComponentLView[FLAGS] |= LViewFlags.Dirty;
  }
}

function setNgReflectProperty(
    lView: LView, element: RElement | RComment, type: TNodeType, attrName: string, value: any) {
  const renderer = lView[RENDERER];
  attrName = normalizeDebugBindingName(attrName);
  const debugValue = normalizeDebugBindingValue(value);
  if (type === TNodeType.Element) {
    if (value == null) {
      isProceduralRenderer(renderer) ? renderer.removeAttribute((element as RElement), attrName) :
                                       (element as RElement).removeAttribute(attrName);
    } else {
      isProceduralRenderer(renderer) ?
          renderer.setAttribute((element as RElement), attrName, debugValue) :
          (element as RElement).setAttribute(attrName, debugValue);
    }
  } else {
    const textContent = `bindings=${JSON.stringify({[attrName]: debugValue}, null, 2)}`;
    if (isProceduralRenderer(renderer)) {
      renderer.setValue((element as RComment), textContent);
    } else {
      (element as RComment).textContent = textContent;
    }
  }
}

export function setNgReflectProperties(
    lView: LView, element: RElement | RComment, type: TNodeType, dataValue: PropertyAliasValue,
    value: any) {
  if (type === TNodeType.Element || type === TNodeType.Container) {
    /**
     * dataValue is an array containing runtime input or output names for the directives:
     * i+0: directive instance index
     * i+1: privateName
     *
     * e.g. [0, 'change', 'change-minified']
     * we want to set the reflected property with the privateName: dataValue[i+1]
     */
    for (let i = 0; i < dataValue.length; i += 2) {
      setNgReflectProperty(lView, element, type, dataValue[i + 1] as string, value);
    }
  }
}

function validateProperty(
    hostView: LView, element: RElement | RComment, propName: string, tNode: TNode): boolean {
  // The property is considered valid if the element matches the schema, it exists on the element
  // or it is synthetic, and we are in a browser context (web worker nodes should be skipped).
  return matchingSchemas(hostView, tNode.tagName) || propName in element ||
      isAnimationProp(propName) || typeof Node !== 'function' || !(element instanceof Node);
}

export function matchingSchemas(hostView: LView, tagName: string | null): boolean {
  const schemas = hostView[TVIEW].schemas;

  if (schemas !== null) {
    for (let i = 0; i < schemas.length; i++) {
      const schema = schemas[i];
      if (schema === NO_ERRORS_SCHEMA ||
          schema === CUSTOM_ELEMENTS_SCHEMA && tagName && tagName.indexOf('-') > -1) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Logs a warning that a property is not supported on an element.
 * @param propName Name of the invalid property.
 * @param tNode Node on which we encountered the property.
 */
function warnAboutUnknownProperty(propName: string, tNode: TNode): void {
  console.warn(
      `Can't bind to '${propName}' since it isn't a known property of '${tNode.tagName}'.`);
}

/**
 * Instantiate a root component.
 */
export function instantiateRootComponent<T>(tView: TView, lView: LView, def: ComponentDef<T>): T {
  const rootTNode = getPreviousOrParentTNode();
  if (tView.firstCreatePass) {
    if (def.providersResolver) def.providersResolver(def);
    generateExpandoInstructionBlock(tView, rootTNode, 1);
    baseResolveDirective(tView, lView, def);
  }
  const directive =
      getNodeInjectable(tView.data, lView, lView.length - 1, rootTNode as TElementNode);
  attachPatchData(directive, lView);
  const native = getNativeByTNode(rootTNode, lView);
  if (native) {
    attachPatchData(native, lView);
  }
  return directive;
}

/**
 * Resolve the matched directives on a node.
 */
export function resolveDirectives(
    tView: TView, lView: LView, tNode: TElementNode | TContainerNode | TElementContainerNode,
    localRefs: string[] | null): boolean {
  // Please make sure to have explicit type for `exportsMap`. Inferred type triggers bug in
  // tsickle.
  ngDevMode && assertFirstCreatePass(tView);

  if (!getBindingsEnabled()) return false;

  const directives: DirectiveDef<any>[]|null = findDirectiveMatches(tView, lView, tNode);
  const exportsMap: ({[key: string]: number} | null) = localRefs === null ? null : {'': -1};
  let hasDirectives = false;

  if (directives !== null) {
    hasDirectives = true;
    initNodeFlags(tNode, tView.data.length, directives.length);
    // When the same token is provided by several directives on the same node, some rules apply in
    // the viewEngine:
    // - viewProviders have priority over providers
    // - the last directive in NgModule.declarations has priority over the previous one
    // So to match these rules, the order in which providers are added in the arrays is very
    // important.
    for (let i = 0; i < directives.length; i++) {
      const def = directives[i] as DirectiveDef<any>;
      if (def.providersResolver) def.providersResolver(def);
    }
    generateExpandoInstructionBlock(tView, tNode, directives.length);
    const initialPreOrderHooksLength = (tView.preOrderHooks && tView.preOrderHooks.length) || 0;
    const initialPreOrderCheckHooksLength =
        (tView.preOrderCheckHooks && tView.preOrderCheckHooks.length) || 0;
    const nodeIndex = tNode.index - HEADER_OFFSET;
    for (let i = 0; i < directives.length; i++) {
      const def = directives[i] as DirectiveDef<any>;

      const directiveDefIdx = tView.data.length;
      baseResolveDirective(tView, lView, def);

      saveNameToExportMap(tView.data !.length - 1, def, exportsMap);

      if (def.contentQueries !== null) tNode.flags |= TNodeFlags.hasContentQuery;
      if (def.hostBindings !== null) tNode.flags |= TNodeFlags.hasHostBindings;

      // Init hooks are queued now so ngOnInit is called in host components before
      // any projected components.
      registerPreOrderHooks(
          directiveDefIdx, def, tView, nodeIndex, initialPreOrderHooksLength,
          initialPreOrderCheckHooksLength);
    }

    initializeInputAndOutputAliases(tView, tNode);
  }
  if (exportsMap) cacheMatchingLocalNames(tNode, localRefs, exportsMap);
  return hasDirectives;
}

/**
 * Instantiate all the directives that were previously resolved on the current node.
 */
function instantiateAllDirectives(
    tView: TView, lView: LView, tNode: TDirectiveHostNode, native: RNode) {
  const start = tNode.directiveStart;
  const end = tNode.directiveEnd;
  if (!tView.firstCreatePass) {
    getOrCreateNodeInjectorForNode(tNode, lView);
  }

  attachPatchData(native, lView);

  const initialInputs = tNode.initialInputs;
  for (let i = start; i < end; i++) {
    const def = tView.data[i] as DirectiveDef<any>;
    const isComponent = isComponentDef(def);

    if (isComponent) {
      ngDevMode && assertNodeOfPossibleTypes(tNode, TNodeType.Element);
      addComponentLogic(lView, tNode as TElementNode, def as ComponentDef<any>);
    }

    const directive = getNodeInjectable(tView.data, lView, i, tNode);
    attachPatchData(directive, lView);

    if (initialInputs !== null) {
      setInputsFromAttrs(lView, i - start, directive, def, tNode, initialInputs !);
    }

    if (isComponent) {
      const componentView = getComponentLViewByIndex(tNode.index, lView);
      componentView[CONTEXT] = directive;
    }
  }
}

function invokeDirectivesHostBindings(tView: TView, viewData: LView, tNode: TNode) {
  const start = tNode.directiveStart;
  const end = tNode.directiveEnd;
  const expando = tView.expandoInstructions !;
  const firstCreatePass = tView.firstCreatePass;
  const elementIndex = tNode.index - HEADER_OFFSET;
  try {
    setActiveHostElement(elementIndex);

    for (let i = start; i < end; i++) {
      const def = tView.data[i] as DirectiveDef<any>;
      const directive = viewData[i];
      if (def.hostBindings) {
        // It is important that this be called first before the actual instructions
        // are run because this way the first directive ID value is not zero.
        incrementActiveDirectiveId();
        invokeHostBindingsInCreationMode(def, expando, directive, tNode, firstCreatePass);
      } else if (firstCreatePass) {
        expando.push(null);
      }
    }
  } finally {
    setActiveHostElement(null);
  }
}

export function invokeHostBindingsInCreationMode(
    def: DirectiveDef<any>, expando: ExpandoInstructions, directive: any, tNode: TNode,
    firstCreatePass: boolean) {
  const previousExpandoLength = expando.length;
  setCurrentDirectiveDef(def);
  const elementIndex = tNode.index - HEADER_OFFSET;
  def.hostBindings !(RenderFlags.Create, directive, elementIndex);
  setCurrentDirectiveDef(null);
  // `hostBindings` function may or may not contain `allocHostVars` call
  // (e.g. it may not if it only contains host listeners), so we need to check whether
  // `expandoInstructions` has changed and if not - we still push `hostBindings` to
  // expando block, to make sure we execute it for DI cycle
  if (previousExpandoLength === expando.length && firstCreatePass) {
    expando.push(def.hostBindings);
  }
}

/**
* Generates a new block in TView.expandoInstructions for this node.
*
* Each expando block starts with the element index (turned negative so we can distinguish
* it from the hostVar count) and the directive count. See more in VIEW_DATA.md.
*/
export function generateExpandoInstructionBlock(
    tView: TView, tNode: TNode, directiveCount: number): void {
  ngDevMode && assertEqual(
                   tView.firstCreatePass, true,
                   'Expando block should only be generated on first create pass.');

  const elementIndex = -(tNode.index - HEADER_OFFSET);
  const providerStartIndex = tNode.providerIndexes & TNodeProviderIndexes.ProvidersStartIndexMask;
  const providerCount = tView.data.length - providerStartIndex;
  (tView.expandoInstructions || (tView.expandoInstructions = [
   ])).push(elementIndex, providerCount, directiveCount);
}

/**
* Matches the current node against all available selectors.
* If a component is matched (at most one), it is returned in first position in the array.
*/
function findDirectiveMatches(
    tView: TView, viewData: LView,
    tNode: TElementNode | TContainerNode | TElementContainerNode): DirectiveDef<any>[]|null {
  ngDevMode && assertFirstCreatePass(tView);
  ngDevMode && assertNodeOfPossibleTypes(
                   tNode, TNodeType.Element, TNodeType.ElementContainer, TNodeType.Container);
  const registry = tView.directiveRegistry;
  let matches: any[]|null = null;
  if (registry) {
    for (let i = 0; i < registry.length; i++) {
      const def = registry[i] as ComponentDef<any>| DirectiveDef<any>;
      if (isNodeMatchingSelectorList(tNode, def.selectors !, /* isProjectionMode */ false)) {
        matches || (matches = ngDevMode ? new MatchesArray() : []);
        diPublicInInjector(getOrCreateNodeInjectorForNode(tNode, viewData), tView, def.type);

        if (isComponentDef(def)) {
          if (tNode.flags & TNodeFlags.isComponentHost) throwMultipleComponentError(tNode);
          markAsComponentHost(tView, tNode);
          // The component is always stored first with directives after.
          matches.unshift(def);
        } else {
          matches.push(def);
        }
      }
    }
  }
  return matches;
}

/**
 * Marks a given TNode as a component's host. This consists of:
 * - setting appropriate TNode flags;
 * - storing index of component's host element so it will be queued for view refresh during CD.
*/
export function markAsComponentHost(tView: TView, hostTNode: TNode): void {
  ngDevMode && assertFirstCreatePass(tView);
  hostTNode.flags |= TNodeFlags.isComponentHost;
  (tView.components || (tView.components = ngDevMode ? new TViewComponents() : [
   ])).push(hostTNode.index);
}


/** Caches local names and their matching directive indices for query and template lookups. */
function cacheMatchingLocalNames(
    tNode: TNode, localRefs: string[] | null, exportsMap: {[key: string]: number}): void {
  if (localRefs) {
    const localNames: (string | number)[] = tNode.localNames =
        ngDevMode ? new TNodeLocalNames() : [];

    // Local names must be stored in tNode in the same order that localRefs are defined
    // in the template to ensure the data is loaded in the same slots as their refs
    // in the template (for template queries).
    for (let i = 0; i < localRefs.length; i += 2) {
      const index = exportsMap[localRefs[i + 1]];
      if (index == null) throw new Error(`Export of name '${localRefs[i + 1]}' not found!`);
      localNames.push(localRefs[i], index);
    }
  }
}

/**
* Builds up an export map as directives are created, so local refs can be quickly mapped
* to their directive instances.
*/
function saveNameToExportMap(
    index: number, def: DirectiveDef<any>| ComponentDef<any>,
    exportsMap: {[key: string]: number} | null) {
  if (exportsMap) {
    if (def.exportAs) {
      for (let i = 0; i < def.exportAs.length; i++) {
        exportsMap[def.exportAs[i]] = index;
      }
    }
    if ((def as ComponentDef<any>).template) exportsMap[''] = index;
  }
}

/**
 * Initializes the flags on the current node, setting all indices to the initial index,
 * the directive count to 0, and adding the isComponent flag.
 * @param index the initial index
 */
export function initNodeFlags(tNode: TNode, index: number, numberOfDirectives: number) {
  ngDevMode && assertNotEqual(
                   numberOfDirectives, tNode.directiveEnd - tNode.directiveStart,
                   'Reached the max number of directives');
  tNode.flags |= TNodeFlags.isDirectiveHost;
  // When the first directive is created on a node, save the index
  tNode.directiveStart = index;
  tNode.directiveEnd = index + numberOfDirectives;
  tNode.providerIndexes = index;
}

function baseResolveDirective<T>(tView: TView, viewData: LView, def: DirectiveDef<T>) {
  tView.data.push(def);
  const directiveFactory = def.factory || (def.factory = getFactoryDef(def.type, true));
  const nodeInjectorFactory = new NodeInjectorFactory(directiveFactory, isComponentDef(def), null);
  tView.blueprint.push(nodeInjectorFactory);
  viewData.push(nodeInjectorFactory);
}

function addComponentLogic<T>(lView: LView, hostTNode: TElementNode, def: ComponentDef<T>): void {
  const native = getNativeByTNode(hostTNode, lView) as RElement;
  const tView = getOrCreateTComponentView(def);

  // Only component views should be added to the view tree directly. Embedded views are
  // accessed through their containers because they may be removed / re-added later.
  const rendererFactory = lView[RENDERER_FACTORY];
  const componentView = addToViewTree(
      lView,
      createLView(
          lView, tView, null, def.onPush ? LViewFlags.Dirty : LViewFlags.CheckAlways, native,
          hostTNode as TElementNode, rendererFactory, rendererFactory.createRenderer(native, def)));

  // Component view will always be created before any injected LContainers,
  // so this is a regular element, wrap it with the component view
  lView[hostTNode.index] = componentView;
}

export function elementAttributeInternal(
    index: number, name: string, value: any, lView: LView, sanitizer?: SanitizerFn | null,
    namespace?: string) {
  ngDevMode && assertNotSame(value, NO_CHANGE as any, 'Incoming value should never be NO_CHANGE.');
  ngDevMode && validateAgainstEventAttributes(name);
  const element = getNativeByIndex(index, lView) as RElement;
  const renderer = lView[RENDERER];
  if (value == null) {
    ngDevMode && ngDevMode.rendererRemoveAttribute++;
    isProceduralRenderer(renderer) ? renderer.removeAttribute(element, name, namespace) :
                                     element.removeAttribute(name);
  } else {
    ngDevMode && ngDevMode.rendererSetAttribute++;
    const tNode = getTNode(index, lView);
    const strValue =
        sanitizer == null ? renderStringify(value) : sanitizer(value, tNode.tagName || '', name);


    if (isProceduralRenderer(renderer)) {
      renderer.setAttribute(element, name, strValue, namespace);
    } else {
      namespace ? element.setAttributeNS(namespace, name, strValue) :
                  element.setAttribute(name, strValue);
    }
  }
}

/**
 * Sets initial input properties on directive instances from attribute data
 *
 * @param lView Current LView that is being processed.
 * @param directiveIndex Index of the directive in directives array
 * @param instance Instance of the directive on which to set the initial inputs
 * @param def The directive def that contains the list of inputs
 * @param tNode The static data for this node
 */
function setInputsFromAttrs<T>(
    lView: LView, directiveIndex: number, instance: T, def: DirectiveDef<T>, tNode: TNode,
    initialInputData: InitialInputData): void {
  const initialInputs: InitialInputs|null = initialInputData ![directiveIndex];
  if (initialInputs !== null) {
    const setInput = def.setInput;
    for (let i = 0; i < initialInputs.length;) {
      const publicName = initialInputs[i++];
      const privateName = initialInputs[i++];
      const value = initialInputs[i++];
      if (setInput !== null) {
        def.setInput !(instance, value, publicName, privateName);
      } else {
        (instance as any)[privateName] = value;
      }
      if (ngDevMode) {
        const nativeElement = getNativeByTNode(tNode, lView) as RElement;
        setNgReflectProperty(lView, nativeElement, tNode.type, privateName, value);
      }
    }
  }
}

/**
 * Generates initialInputData for a node and stores it in the template's static storage
 * so subsequent template invocations don't have to recalculate it.
 *
 * initialInputData is an array containing values that need to be set as input properties
 * for directives on this node, but only once on creation. We need this array to support
 * the case where you set an @Input property of a directive using attribute-like syntax.
 * e.g. if you have a `name` @Input, you can set it once like this:
 *
 * <my-component name="Bess"></my-component>
 *
 * @param inputs The list of inputs from the directive def
 * @param attrs The static attrs on this node
 */
function generateInitialInputs(inputs: {[key: string]: string}, attrs: TAttributes): InitialInputs|
    null {
  let inputsToStore: InitialInputs|null = null;
  let i = 0;
  while (i < attrs.length) {
    const attrName = attrs[i];
    if (attrName === AttributeMarker.NamespaceURI) {
      // We do not allow inputs on namespaced attributes.
      i += 4;
      continue;
    } else if (attrName === AttributeMarker.ProjectAs) {
      // Skip over the `ngProjectAs` value.
      i += 2;
      continue;
    }

    // If we hit any other attribute markers, we're done anyway. None of those are valid inputs.
    if (typeof attrName === 'number') break;

    if (inputs.hasOwnProperty(attrName as string)) {
      if (inputsToStore === null) inputsToStore = [];
      inputsToStore.push(attrName as string, inputs[attrName as string], attrs[i + 1] as string);
    }

    i += 2;
  }
  return inputsToStore;
}

//////////////////////////
//// ViewContainer & View
//////////////////////////

// Not sure why I need to do `any` here but TS complains later.
const LContainerArray: any = ((typeof ngDevMode === 'undefined' || ngDevMode) && initNgDevMode()) &&
    createNamedArrayType('LContainer');

/**
 * Creates a LContainer, either from a container instruction, or for a ViewContainerRef.
 *
 * @param hostNative The host element for the LContainer
 * @param hostTNode The host TNode for the LContainer
 * @param currentView The parent view of the LContainer
 * @param native The native comment element
 * @param isForViewContainerRef Optional a flag indicating the ViewContainerRef case
 * @returns LContainer
 */
export function createLContainer(
    hostNative: RElement | RComment | LView, currentView: LView, native: RComment,
    tNode: TNode): LContainer {
  ngDevMode && assertLView(currentView);
  ngDevMode && !isProceduralRenderer(currentView[RENDERER]) && assertDomNode(native);
  // https://jsperf.com/array-literal-vs-new-array-really
  const lContainer: LContainer = new (ngDevMode ? LContainerArray : Array)(
      hostNative,  // host native
      true,        // Boolean `true` in this position signifies that this is an `LContainer`
      ActiveIndexFlag.DYNAMIC_EMBEDDED_VIEWS_ONLY << ActiveIndexFlag.SHIFT,  // active index
      currentView,                                                           // parent
      null,                                                                  // next
      null,                                                                  // queries
      tNode,                                                                 // t_host
      native,                                                                // native,
      null,                                                                  // view refs
      );
  ngDevMode && attachLContainerDebug(lContainer);
  return lContainer;
}


/**
 * Goes over dynamic embedded views (ones created through ViewContainerRef APIs) and refreshes
 * them by executing an associated template function.
 */
function refreshDynamicEmbeddedViews(lView: LView) {
  let viewOrContainer = lView[CHILD_HEAD];
  while (viewOrContainer !== null) {
    // Note: viewOrContainer can be an LView or an LContainer instance, but here we are only
    // interested in LContainer
    let activeIndexFlag: ActiveIndexFlag;
    if (isLContainer(viewOrContainer) &&
        (activeIndexFlag = viewOrContainer[ACTIVE_INDEX]) >> ActiveIndexFlag.SHIFT ===
            ActiveIndexFlag.DYNAMIC_EMBEDDED_VIEWS_ONLY) {
      for (let i = CONTAINER_HEADER_OFFSET; i < viewOrContainer.length; i++) {
        const embeddedLView = viewOrContainer[i];
        const embeddedTView = embeddedLView[TVIEW];
        ngDevMode && assertDefined(embeddedTView, 'TView must be allocated');
        refreshView(embeddedLView, embeddedTView, embeddedTView.template, embeddedLView[CONTEXT] !);
      }
      if ((activeIndexFlag & ActiveIndexFlag.HAS_TRANSPLANTED_VIEWS) !== 0) {
        // We should only CD moved views if the component where they were inserted does not match
        // the component where they were declared and insertion is on-push. Moved views also
        // contains intra component moves, or check-always which need to be skipped.
        refreshTransplantedViews(viewOrContainer, lView[DECLARATION_COMPONENT_VIEW] !);
      }
    }
    viewOrContainer = viewOrContainer[NEXT];
  }
}


/**
 * Refresh transplanted LViews.
 *
 * See: `ActiveIndexFlag.HAS_TRANSPLANTED_VIEWS` and `LView[DECLARATION_COMPONENT_VIEW]` for
 * explanation of transplanted views.
 *
 * @param lContainer The `LContainer` which has transplanted views.
 * @param declaredComponentLView The `lContainer` parent component `LView`.
 */
function refreshTransplantedViews(lContainer: LContainer, declaredComponentLView: LView) {
  const movedViews = lContainer[MOVED_VIEWS] !;
  ngDevMode && assertDefined(movedViews, 'Transplanted View flags set but missing MOVED_VIEWS');
  for (let i = 0; i < movedViews.length; i++) {
    const movedLView = movedViews[i] !;
    const insertionLContainer = movedLView[PARENT] as LContainer;
    ngDevMode && assertLContainer(insertionLContainer);
    const insertedComponentLView = insertionLContainer[PARENT][DECLARATION_COMPONENT_VIEW] !;
    ngDevMode && assertDefined(insertedComponentLView, 'Missing LView');
    // Check if we have a transplanted view by compering declaration and insertion location.
    if (insertedComponentLView !== declaredComponentLView) {
      // Yes the `LView` is transplanted.
      // Here we would like to know if the component is `OnPush`. We don't have
      // explicit `OnPush` flag instead we set `CheckAlways` to false (which is `OnPush`)
      // Not to be confused with `ManualOnPush` which is used with wether a DOM event
      // should automatically mark a view as dirty.
      const insertionComponentIsOnPush =
          (insertedComponentLView[FLAGS] & LViewFlags.CheckAlways) === 0;
      if (insertionComponentIsOnPush) {
        // Here we know that the template has been transplanted across components and is
        // on-push (not just moved within a component). If the insertion is marked dirty, then
        // there is no need to CD here as we will do it again later when we get to insertion
        // point.
        const movedTView = movedLView[TVIEW];
        ngDevMode && assertDefined(movedTView, 'TView must be allocated');
        refreshView(movedLView, movedTView, movedTView.template, movedLView[CONTEXT] !);
      }
    }
  }
}

/////////////

/**
 * Refreshes components by entering the component view and processing its bindings, queries, etc.
 *
 * @param componentHostIdx  Element index in LView[] (adjusted for HEADER_OFFSET)
 */
function refreshComponent(hostLView: LView, componentHostIdx: number): void {
  ngDevMode && assertEqual(isCreationMode(hostLView), false, 'Should be run in update mode');
  const componentView = getComponentLViewByIndex(componentHostIdx, hostLView);
  // Only attached components that are CheckAlways or OnPush and dirty should be refreshed
  if (viewAttachedToChangeDetector(componentView) &&
      componentView[FLAGS] & (LViewFlags.CheckAlways | LViewFlags.Dirty)) {
    const tView = componentView[TVIEW];
    refreshView(componentView, tView, tView.template, componentView[CONTEXT]);
  }
}

function renderComponent(hostLView: LView, componentHostIdx: number) {
  ngDevMode && assertEqual(isCreationMode(hostLView), true, 'Should be run in creation mode');
  const componentView = getComponentLViewByIndex(componentHostIdx, hostLView);
  syncViewWithBlueprint(componentView);
  renderView(componentView, componentView[TVIEW], componentView[CONTEXT]);
}

/**
 * Syncs an LView instance with its blueprint if they have gotten out of sync.
 *
 * Typically, blueprints and their view instances should always be in sync, so the loop here
 * will be skipped. However, consider this case of two components side-by-side:
 *
 * App template:
 * ```
 * <comp></comp>
 * <comp></comp>
 * ```
 *
 * The following will happen:
 * 1. App template begins processing.
 * 2. First <comp> is matched as a component and its LView is created.
 * 3. Second <comp> is matched as a component and its LView is created.
 * 4. App template completes processing, so it's time to check child templates.
 * 5. First <comp> template is checked. It has a directive, so its def is pushed to blueprint.
 * 6. Second <comp> template is checked. Its blueprint has been updated by the first
 * <comp> template, but its LView was created before this update, so it is out of sync.
 *
 * Note that embedded views inside ngFor loops will never be out of sync because these views
 * are processed as soon as they are created.
 *
 * @param componentView The view to sync
 */
function syncViewWithBlueprint(componentView: LView) {
  const componentTView = componentView[TVIEW];
  for (let i = componentView.length; i < componentTView.blueprint.length; i++) {
    componentView.push(componentTView.blueprint[i]);
  }
}

/**
 * Adds LView or LContainer to the end of the current view tree.
 *
 * This structure will be used to traverse through nested views to remove listeners
 * and call onDestroy callbacks.
 *
 * @param lView The view where LView or LContainer should be added
 * @param adjustedHostIndex Index of the view's host node in LView[], adjusted for header
 * @param lViewOrLContainer The LView or LContainer to add to the view tree
 * @returns The state passed in
 */
export function addToViewTree<T extends LView|LContainer>(lView: LView, lViewOrLContainer: T): T {
  // TODO(benlesh/misko): This implementation is incorrect, because it always adds the LContainer
  // to
  // the end of the queue, which means if the developer retrieves the LContainers from RNodes out
  // of
  // order, the change detection will run out of order, as the act of retrieving the the
  // LContainer
  // from the RNode is what adds it to the queue.
  if (lView[CHILD_HEAD]) {
    lView[CHILD_TAIL] ![NEXT] = lViewOrLContainer;
  } else {
    lView[CHILD_HEAD] = lViewOrLContainer;
  }
  lView[CHILD_TAIL] = lViewOrLContainer;
  return lViewOrLContainer;
}

///////////////////////////////
//// Change detection
///////////////////////////////


/**
 * Marks current view and all ancestors dirty.
 *
 * Returns the root view because it is found as a byproduct of marking the view tree
 * dirty, and can be used by methods that consume markViewDirty() to easily schedule
 * change detection. Otherwise, such methods would need to traverse up the view tree
 * an additional time to get the root view and schedule a tick on it.
 *
 * @param lView The starting LView to mark dirty
 * @returns the root LView
 */
export function markViewDirty(lView: LView): LView|null {
  while (lView) {
    lView[FLAGS] |= LViewFlags.Dirty;
    const parent = getLViewParent(lView);
    // Stop traversing up as soon as you find a root view that wasn't attached to any container
    if (isRootView(lView) && !parent) {
      return lView;
    }
    // continue otherwise
    lView = parent !;
  }
  return null;
}


/**
 * Used to schedule change detection on the whole application.
 *
 * Unlike `tick`, `scheduleTick` coalesces multiple calls into one change detection run.
 * It is usually called indirectly by calling `markDirty` when the view needs to be
 * re-rendered.
 *
 * Typically `scheduleTick` uses `requestAnimationFrame` to coalesce multiple
 * `scheduleTick` requests. The scheduling function can be overridden in
 * `renderComponent`'s `scheduler` option.
 */
export function scheduleTick(rootContext: RootContext, flags: RootContextFlags) {
  const nothingScheduled = rootContext.flags === RootContextFlags.Empty;
  rootContext.flags |= flags;

  if (nothingScheduled && rootContext.clean == _CLEAN_PROMISE) {
    let res: null|((val: null) => void);
    rootContext.clean = new Promise<null>((r) => res = r);
    rootContext.scheduler(() => {
      if (rootContext.flags & RootContextFlags.DetectChanges) {
        rootContext.flags &= ~RootContextFlags.DetectChanges;
        tickRootContext(rootContext);
      }

      if (rootContext.flags & RootContextFlags.FlushPlayers) {
        rootContext.flags &= ~RootContextFlags.FlushPlayers;
        const playerHandler = rootContext.playerHandler;
        if (playerHandler) {
          playerHandler.flushPlayers();
        }
      }

      rootContext.clean = _CLEAN_PROMISE;
      res !(null);
    });
  }
}

export function tickRootContext(rootContext: RootContext) {
  for (let i = 0; i < rootContext.components.length; i++) {
    const rootComponent = rootContext.components[i];
    const lView = readPatchedLView(rootComponent) !;
    const tView = lView[TVIEW];
    renderComponentOrTemplate(lView, tView.template, rootComponent);
  }
}

export function detectChangesInternal<T>(view: LView, context: T) {
  const rendererFactory = view[RENDERER_FACTORY];
  if (rendererFactory.begin) rendererFactory.begin();
  try {
    const tView = view[TVIEW];
    refreshView(view, tView, tView.template, context);
  } catch (error) {
    handleError(view, error);
    throw error;
  } finally {
    if (rendererFactory.end) rendererFactory.end();
  }
}

/**
 * Synchronously perform change detection on a root view and its components.
 *
 * @param lView The view which the change detection should be performed on.
 */
export function detectChangesInRootView(lView: LView): void {
  tickRootContext(lView[CONTEXT] as RootContext);
}

export function checkNoChangesInternal<T>(view: LView, context: T) {
  setCheckNoChangesMode(true);
  try {
    detectChangesInternal(view, context);
  } finally {
    setCheckNoChangesMode(false);
  }
}

/**
 * Checks the change detector on a root view and its components, and throws if any changes are
 * detected.
 *
 * This is used in development mode to verify that running change detection doesn't
 * introduce other changes.
 *
 * @param lView The view which the change detection should be checked on.
 */
export function checkNoChangesInRootView(lView: LView): void {
  setCheckNoChangesMode(true);
  try {
    detectChangesInRootView(lView);
  } finally {
    setCheckNoChangesMode(false);
  }
}

function executeViewQueryFn<T>(
    flags: RenderFlags, viewQueryFn: ViewQueriesFunction<{}>, component: T): void {
  ngDevMode && assertDefined(viewQueryFn, 'View queries function to execute must be defined.');
  setCurrentQueryIndex(0);
  viewQueryFn(flags, component);
}


///////////////////////////////
//// Bindings & interpolations
///////////////////////////////

/**
 * Stores meta-data for a property binding to be used by TestBed's `DebugElement.properties`.
 *
 * In order to support TestBed's `DebugElement.properties` we need to save, for each binding:
 * - a bound property name;
 * - a static parts of interpolated strings;
 *
 * A given property metadata is saved at the binding's index in the `TView.data` (in other words, a
 * property binding metadata will be stored in `TView.data` at the same index as a bound value in
 * `LView`). Metadata are represented as `INTERPOLATION_DELIMITER`-delimited string with the
 * following format:
 * - `propertyName` for bound properties;
 * - `propertyName�prefix�interpolation_static_part1�..interpolation_static_partN�suffix` for
 * interpolated properties.
 *
 * @param tData `TData` where meta-data will be saved;
 * @param nodeIndex index of a `TNode` that is a target of the binding;
 * @param propertyName bound property name;
 * @param bindingIndex binding index in `LView`
 * @param interpolationParts static interpolation parts (for property interpolations)
 */
export function storePropertyBindingMetadata(
    tData: TData, nodeIndex: number, propertyName: string, bindingIndex: number,
    ...interpolationParts: string[]) {
  // Binding meta-data are stored only the first time a given property instruction is processed.
  // Since we don't have a concept of the "first update pass" we need to check for presence of the
  // binding meta-data to decide if one should be stored (or if was stored already).
  if (tData[bindingIndex] === null) {
    const tNode = tData[nodeIndex + HEADER_OFFSET] as TNode;
    if (tNode.inputs == null || !tNode.inputs[propertyName]) {
      const propBindingIdxs = tNode.propertyBindings || (tNode.propertyBindings = []);
      propBindingIdxs.push(bindingIndex);
      let bindingMetadata = propertyName;
      if (interpolationParts.length > 0) {
        bindingMetadata +=
            INTERPOLATION_DELIMITER + interpolationParts.join(INTERPOLATION_DELIMITER);
      }
      tData[bindingIndex] = bindingMetadata;
    }
  }
}

export const CLEAN_PROMISE = _CLEAN_PROMISE;

export function getCleanup(view: LView): any[] {
  // top level variables should not be exported for performance reasons (PERF_NOTES.md)
  return view[CLEANUP] || (view[CLEANUP] = ngDevMode ? new LCleanup() : []);
}

function getTViewCleanup(view: LView): any[] {
  return view[TVIEW].cleanup || (view[TVIEW].cleanup = ngDevMode ? new TCleanup() : []);
}

/**
 * There are cases where the sub component's renderer needs to be included
 * instead of the current renderer (see the componentSyntheticHost* instructions).
 */
export function loadComponentRenderer(tNode: TNode, lView: LView): Renderer3 {
  const componentLView = lView[tNode.index] as LView;
  return componentLView[RENDERER];
}

/** Handles an error thrown in an LView. */
export function handleError(lView: LView, error: any): void {
  const injector = lView[INJECTOR];
  const errorHandler = injector ? injector.get(ErrorHandler, null) : null;
  errorHandler && errorHandler.handleError(error);
}

/**
 * Set the inputs of directives at the current node to corresponding value.
 *
 * @param lView the `LView` which contains the directives.
 * @param inputs mapping between the public "input" name and privately-known,
 * possibly minified, property names to write to.
 * @param value Value to set.
 */
export function setInputsForProperty(
    lView: LView, inputs: PropertyAliasValue, publicName: string, value: any): void {
  const tView = lView[TVIEW];
  for (let i = 0; i < inputs.length;) {
    const index = inputs[i++] as number;
    const privateName = inputs[i++] as string;
    const instance = lView[index];
    ngDevMode && assertDataInRange(lView, index);
    const def = tView.data[index] as DirectiveDef<any>;
    if (def.setInput !== null) {
      def.setInput !(instance, value, publicName, privateName);
    } else {
      instance[privateName] = value;
    }
  }
}

/**
 * Updates a text binding at a given index in a given LView.
 */
export function textBindingInternal(lView: LView, index: number, value: string): void {
  ngDevMode && assertNotSame(value, NO_CHANGE as any, 'value should not be NO_CHANGE');
  ngDevMode && assertDataInRange(lView, index + HEADER_OFFSET);
  const element = getNativeByIndex(index, lView) as any as RText;
  ngDevMode && assertDefined(element, 'native element should exist');
  ngDevMode && ngDevMode.rendererSetText++;
  const renderer = lView[RENDERER];
  isProceduralRenderer(renderer) ? renderer.setValue(element, value) : element.textContent = value;
}

/**
 * Renders all initial styling (class and style values) on to the element from the tNode.
 *
 * All initial styling data (i.e. any values extracted from the `style` or `class` attributes
 * on an element) are collected into the `tNode.styles` and `tNode.classes` data structures.
 * These values are populated during the creation phase of an element and are then later
 * applied once the element is instantiated. This function applies each of the static
 * style and class entries to the element.
 */
export function renderInitialStyling(
    renderer: Renderer3, native: RElement, tNode: TNode, append: boolean) {
  if (tNode.classes !== null) {
    if (append) {
      renderStylingMap(renderer, native, tNode.classes, true);
    } else {
      const classes = getInitialStylingValue(tNode.classes);
      writeStylingValueDirectly(renderer, native, classes, true, null);
    }
  }
  if (tNode.styles !== null) {
    if (append) {
      renderStylingMap(renderer, native, tNode.styles, false);
    } else {
      const styles = getInitialStylingValue(tNode.styles);
      writeStylingValueDirectly(renderer, native, styles, false, null);
    }
  }
}
