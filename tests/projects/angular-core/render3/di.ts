/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {isForwardRef, resolveForwardRef} from '../di/forward_ref';
import {InjectionToken} from '../di/injection_token';
import {Injector} from '../di/injector';
import {injectRootLimpMode, setInjectImplementation} from '../di/injector_compatibility';
import {getInjectorDef} from '../di/interface/defs';
import {InjectFlags} from '../di/interface/injector';
import {Type} from '../interface/type';
import {assertDefined, assertEqual} from '../util/assert';

import {getFactoryDef} from './definition';
import {NG_ELEMENT_ID, NG_FACTORY_DEF} from './fields';
import {DirectiveDef, FactoryFn} from './interfaces/definition';
import {NO_PARENT_INJECTOR, NodeInjectorFactory, PARENT_INJECTOR, RelativeInjectorLocation, RelativeInjectorLocationFlags, TNODE, isFactory} from './interfaces/injector';
import {AttributeMarker, TContainerNode, TDirectiveHostNode, TElementContainerNode, TElementNode, TNode, TNodeProviderIndexes, TNodeType} from './interfaces/node';
import {isComponentDef, isComponentHost} from './interfaces/type_checks';
import {DECLARATION_COMPONENT_VIEW, DECLARATION_VIEW, INJECTOR, LView, TData, TVIEW, TView, T_HOST} from './interfaces/view';
import {assertNodeOfPossibleTypes} from './node_assert';
import {enterDI, leaveDI} from './state';
import {isNameOnlyAttributeMarker} from './util/attrs_utils';
import {getParentInjectorIndex, getParentInjectorView, hasParentInjector} from './util/injector_utils';
import {stringifyForError} from './util/misc_utils';
import {getInitialStylingValue} from './util/styling_utils';



/**
 * Defines if the call to `inject` should include `viewProviders` in its resolution.
 *
 * This is set to true when we try to instantiate a component. This value is reset in
 * `getNodeInjectable` to a value which matches the declaration location of the token about to be
 * instantiated. This is done so that if we are injecting a token which was declared outside of
 * `viewProviders` we don't accidentally pull `viewProviders` in.
 *
 * Example:
 *
 * ```
 * @Injectable()
 * class MyService {
 *   constructor(public value: String) {}
 * }
 *
 * @Component({
 *   providers: [
 *     MyService,
 *     {provide: String, value: 'providers' }
 *   ]
 *   viewProviders: [
 *     {provide: String, value: 'viewProviders'}
 *   ]
 * })
 * class MyComponent {
 *   constructor(myService: MyService, value: String) {
 *     // We expect that Component can see into `viewProviders`.
 *     expect(value).toEqual('viewProviders');
 *     // `MyService` was not declared in `viewProviders` hence it can't see it.
 *     expect(myService.value).toEqual('providers');
 *   }
 * }
 *
 * ```
 */
let includeViewProviders = true;

function setIncludeViewProviders(v: boolean): boolean {
  const oldValue = includeViewProviders;
  includeViewProviders = v;
  return oldValue;
}

/**
 * The number of slots in each bloom filter (used by DI). The larger this number, the fewer
 * directives that will share slots, and thus, the fewer false positives when checking for
 * the existence of a directive.
 */
const BLOOM_SIZE = 256;
const BLOOM_MASK = BLOOM_SIZE - 1;

/** Counter used to generate unique IDs for directives. */
let nextNgElementId = 0;

/**
 * Registers this directive as present in its node's injector by flipping the directive's
 * corresponding bit in the injector's bloom filter.
 *
 * @param injectorIndex The index of the node injector where this token should be registered
 * @param tView The TView for the injector's bloom filters
 * @param type The directive token to register
 */
export function bloomAdd(
    injectorIndex: number, tView: TView, type: Type<any>| InjectionToken<any>| string): void {
  ngDevMode && assertEqual(tView.firstCreatePass, true, 'expected firstCreatePass to be true');
  let id: number|undefined =
      typeof type !== 'string' ? (type as any)[NG_ELEMENT_ID] : type.charCodeAt(0) || 0;

  // Set a unique ID on the directive type, so if something tries to inject the directive,
  // we can easily retrieve the ID and hash it into the bloom bit that should be checked.
  if (id == null) {
    id = (type as any)[NG_ELEMENT_ID] = nextNgElementId++;
  }

  // We only have BLOOM_SIZE (256) slots in our bloom filter (8 buckets * 32 bits each),
  // so all unique IDs must be modulo-ed into a number from 0 - 255 to fit into the filter.
  const bloomBit = id & BLOOM_MASK;

  // Create a mask that targets the specific bit associated with the directive.
  // JS bit operations are 32 bits, so this will be a number between 2^0 and 2^31, corresponding
  // to bit positions 0 - 31 in a 32 bit integer.
  const mask = 1 << bloomBit;

  // Use the raw bloomBit number to determine which bloom filter bucket we should check
  // e.g: bf0 = [0 - 31], bf1 = [32 - 63], bf2 = [64 - 95], bf3 = [96 - 127], etc
  const b7 = bloomBit & 0x80;
  const b6 = bloomBit & 0x40;
  const b5 = bloomBit & 0x20;
  const tData = tView.data as number[];

  if (b7) {
    b6 ? (b5 ? (tData[injectorIndex + 7] |= mask) : (tData[injectorIndex + 6] |= mask)) :
         (b5 ? (tData[injectorIndex + 5] |= mask) : (tData[injectorIndex + 4] |= mask));
  } else {
    b6 ? (b5 ? (tData[injectorIndex + 3] |= mask) : (tData[injectorIndex + 2] |= mask)) :
         (b5 ? (tData[injectorIndex + 1] |= mask) : (tData[injectorIndex] |= mask));
  }
}

/**
 * Creates (or gets an existing) injector for a given element or container.
 *
 * @param tNode for which an injector should be retrieved / created.
 * @param hostView View where the node is stored
 * @returns Node injector
 */
export function getOrCreateNodeInjectorForNode(
    tNode: TElementNode | TContainerNode | TElementContainerNode, hostView: LView): number {
  const existingInjectorIndex = getInjectorIndex(tNode, hostView);
  if (existingInjectorIndex !== -1) {
    return existingInjectorIndex;
  }

  const tView = hostView[TVIEW];
  if (tView.firstCreatePass) {
    tNode.injectorIndex = hostView.length;
    insertBloom(tView.data, tNode);  // foundation for node bloom
    insertBloom(hostView, null);     // foundation for cumulative bloom
    insertBloom(tView.blueprint, null);
  }

  const parentLoc = getParentInjectorLocation(tNode, hostView);
  const injectorIndex = tNode.injectorIndex;

  // If a parent injector can't be found, its location is set to -1.
  // In that case, we don't need to set up a cumulative bloom
  if (hasParentInjector(parentLoc)) {
    const parentIndex = getParentInjectorIndex(parentLoc);
    const parentLView = getParentInjectorView(parentLoc, hostView);
    const parentData = parentLView[TVIEW].data as any;
    // Creates a cumulative bloom filter that merges the parent's bloom filter
    // and its own cumulative bloom (which contains tokens for all ancestors)
    for (let i = 0; i < 8; i++) {
      hostView[injectorIndex + i] = parentLView[parentIndex + i] | parentData[parentIndex + i];
    }
  }

  hostView[injectorIndex + PARENT_INJECTOR] = parentLoc;
  return injectorIndex;
}

function insertBloom(arr: any[], footer: TNode | null): void {
  arr.push(0, 0, 0, 0, 0, 0, 0, 0, footer);
}


export function getInjectorIndex(tNode: TNode, hostView: LView): number {
  if (tNode.injectorIndex === -1 ||
      // If the injector index is the same as its parent's injector index, then the index has been
      // copied down from the parent node. No injector has been created yet on this node.
      (tNode.parent && tNode.parent.injectorIndex === tNode.injectorIndex) ||
      // After the first template pass, the injector index might exist but the parent values
      // might not have been calculated yet for this instance
      hostView[tNode.injectorIndex + PARENT_INJECTOR] == null) {
    return -1;
  } else {
    return tNode.injectorIndex;
  }
}

/**
 * Finds the index of the parent injector, with a view offset if applicable. Used to set the
 * parent injector initially.
 *
 * Returns a combination of number of `ViewData` we have to go up and index in that `Viewdata`
 */
export function getParentInjectorLocation(tNode: TNode, view: LView): RelativeInjectorLocation {
  if (tNode.parent && tNode.parent.injectorIndex !== -1) {
    return tNode.parent.injectorIndex as any;  // ViewOffset is 0
  }

  // For most cases, the parent injector index can be found on the host node (e.g. for component
  // or container), so this loop will be skipped, but we must keep the loop here to support
  // the rarer case of deeply nested <ng-template> tags or inline views.
  let hostTNode = view[T_HOST];
  let viewOffset = 1;
  while (hostTNode && hostTNode.injectorIndex === -1) {
    view = view[DECLARATION_VIEW] !;
    hostTNode = view ? view[T_HOST] : null;
    viewOffset++;
  }

  return hostTNode ?
      hostTNode.injectorIndex | (viewOffset << RelativeInjectorLocationFlags.ViewOffsetShift) :
      -1 as any;
}

/**
 * Makes a type or an injection token public to the DI system by adding it to an
 * injector's bloom filter.
 *
 * @param di The node injector in which a directive will be added
 * @param token The type or the injection token to be made public
 */
export function diPublicInInjector(
    injectorIndex: number, tView: TView, token: InjectionToken<any>| Type<any>): void {
  bloomAdd(injectorIndex, tView, token);
}

/**
 * Inject static attribute value into directive constructor.
 *
 * This method is used with `factory` functions which are generated as part of
 * `defineDirective` or `defineComponent`. The method retrieves the static value
 * of an attribute. (Dynamic attributes are not supported since they are not resolved
 *  at the time of injection and can change over time.)
 *
 * # Example
 * Given:
 * ```
 * @Component(...)
 * class MyComponent {
 *   constructor(@Attribute('title') title: string) { ... }
 * }
 * ```
 * When instantiated with
 * ```
 * <my-component title="Hello"></my-component>
 * ```
 *
 * Then factory method generated is:
 * ```
 * MyComponent.ɵcmp = defineComponent({
 *   factory: () => new MyComponent(injectAttribute('title'))
 *   ...
 * })
 * ```
 *
 * @publicApi
 */
export function injectAttributeImpl(tNode: TNode, attrNameToInject: string): string|null {
  ngDevMode && assertNodeOfPossibleTypes(
                   tNode, TNodeType.Container, TNodeType.Element, TNodeType.ElementContainer);
  ngDevMode && assertDefined(tNode, 'expecting tNode');
  if (attrNameToInject === 'class') {
    return getInitialStylingValue(tNode.classes);
  }
  if (attrNameToInject === 'style') {
    return getInitialStylingValue(tNode.styles);
  }

  const attrs = tNode.attrs;
  if (attrs) {
    const attrsLength = attrs.length;
    let i = 0;
    while (i < attrsLength) {
      const value = attrs[i];

      // If we hit a `Bindings` or `Template` marker then we are done.
      if (isNameOnlyAttributeMarker(value)) break;

      // Skip namespaced attributes
      if (value === AttributeMarker.NamespaceURI) {
        // we skip the next two values
        // as namespaced attributes looks like
        // [..., AttributeMarker.NamespaceURI, 'http://someuri.com/test', 'test:exist',
        // 'existValue', ...]
        i = i + 2;
      } else if (typeof value === 'number') {
        // Skip to the first value of the marked attribute.
        i++;
        while (i < attrsLength && typeof attrs[i] === 'string') {
          i++;
        }
      } else if (value === attrNameToInject) {
        return attrs[i + 1] as string;
      } else {
        i = i + 2;
      }
    }
  }
  return null;
}


/**
 * Returns the value associated to the given token from the NodeInjectors => ModuleInjector.
 *
 * Look for the injector providing the token by walking up the node injector tree and then
 * the module injector tree.
 *
 * This function patches `token` with `__NG_ELEMENT_ID__` which contains the id for the bloom
 * filter. Negative values are reserved for special objects.
 *   - `-1` is reserved for injecting `Injector` (implemented by `NodeInjector`)
 *
 * @param tNode The Node where the search for the injector should start
 * @param lView The `LView` that contains the `tNode`
 * @param token The token to look for
 * @param flags Injection flags
 * @param notFoundValue The value to return when the injection flags is `InjectFlags.Optional`
 * @returns the value from the injector, `null` when not found, or `notFoundValue` if provided
 */
export function getOrCreateInjectable<T>(
    tNode: TDirectiveHostNode | null, lView: LView, token: Type<T>| InjectionToken<T>,
    flags: InjectFlags = InjectFlags.Default, notFoundValue?: any): T|null {
  if (tNode !== null) {
    const bloomHash = bloomHashBitOrFactory(token);
    // If the ID stored here is a function, this is a special object like ElementRef or TemplateRef
    // so just call the factory function to create it.
    if (typeof bloomHash === 'function') {
      enterDI(lView, tNode);
      try {
        const value = bloomHash();
        if (value == null && !(flags & InjectFlags.Optional)) {
          throw new Error(`No provider for ${stringifyForError(token)}!`);
        } else {
          return value;
        }
      } finally {
        leaveDI();
      }
    } else if (typeof bloomHash == 'number') {
      if (bloomHash === -1) {
        // `-1` is a special value used to identify `Injector` types.
        return new NodeInjector(tNode, lView) as any;
      }
      // If the token has a bloom hash, then it is a token which could be in NodeInjector.

      // A reference to the previous injector TView that was found while climbing the element
      // injector tree. This is used to know if viewProviders can be accessed on the current
      // injector.
      let previousTView: TView|null = null;
      let injectorIndex = getInjectorIndex(tNode, lView);
      let parentLocation: RelativeInjectorLocation = NO_PARENT_INJECTOR;
      let hostTElementNode: TNode|null =
          flags & InjectFlags.Host ? lView[DECLARATION_COMPONENT_VIEW][T_HOST] : null;

      // If we should skip this injector, or if there is no injector on this node, start by
      // searching
      // the parent injector.
      if (injectorIndex === -1 || flags & InjectFlags.SkipSelf) {
        parentLocation = injectorIndex === -1 ? getParentInjectorLocation(tNode, lView) :
                                                lView[injectorIndex + PARENT_INJECTOR];

        if (!shouldSearchParent(flags, false)) {
          injectorIndex = -1;
        } else {
          previousTView = lView[TVIEW];
          injectorIndex = getParentInjectorIndex(parentLocation);
          lView = getParentInjectorView(parentLocation, lView);
        }
      }

      // Traverse up the injector tree until we find a potential match or until we know there
      // *isn't* a match.
      while (injectorIndex !== -1) {
        parentLocation = lView[injectorIndex + PARENT_INJECTOR];

        // Check the current injector. If it matches, see if it contains token.
        const tView = lView[TVIEW];
        if (bloomHasToken(bloomHash, injectorIndex, tView.data)) {
          // At this point, we have an injector which *may* contain the token, so we step through
          // the providers and directives associated with the injector's corresponding node to get
          // the instance.
          const instance: T|null = searchTokensOnInjector<T>(
              injectorIndex, lView, token, previousTView, flags, hostTElementNode);
          if (instance !== NOT_FOUND) {
            return instance;
          }
        }
        if (shouldSearchParent(
                flags, lView[TVIEW].data[injectorIndex + TNODE] === hostTElementNode) &&
            bloomHasToken(bloomHash, injectorIndex, lView)) {
          // The def wasn't found anywhere on this node, so it was a false positive.
          // Traverse up the tree and continue searching.
          previousTView = tView;
          injectorIndex = getParentInjectorIndex(parentLocation);
          lView = getParentInjectorView(parentLocation, lView);
        } else {
          // If we should not search parent OR If the ancestor bloom filter value does not have the
          // bit corresponding to the directive we can give up on traversing up to find the specific
          // injector.
          injectorIndex = -1;
        }
      }
    }
  }

  if (flags & InjectFlags.Optional && notFoundValue === undefined) {
    // This must be set or the NullInjector will throw for optional deps
    notFoundValue = null;
  }

  if ((flags & (InjectFlags.Self | InjectFlags.Host)) === 0) {
    const moduleInjector = lView[INJECTOR];
    // switch to `injectInjectorOnly` implementation for module injector, since module injector
    // should not have access to Component/Directive DI scope (that may happen through
    // `directiveInject` implementation)
    const previousInjectImplementation = setInjectImplementation(undefined);
    try {
      if (moduleInjector) {
        return moduleInjector.get(token, notFoundValue, flags & InjectFlags.Optional);
      } else {
        return injectRootLimpMode(token, notFoundValue, flags & InjectFlags.Optional);
      }
    } finally {
      setInjectImplementation(previousInjectImplementation);
    }
  }
  if (flags & InjectFlags.Optional) {
    return notFoundValue;
  } else {
    throw new Error(`NodeInjector: NOT_FOUND [${stringifyForError(token)}]`);
  }
}

const NOT_FOUND = {};

function searchTokensOnInjector<T>(
    injectorIndex: number, lView: LView, token: Type<T>| InjectionToken<T>,
    previousTView: TView | null, flags: InjectFlags, hostTElementNode: TNode | null) {
  const currentTView = lView[TVIEW];
  const tNode = currentTView.data[injectorIndex + TNODE] as TNode;
  // First, we need to determine if view providers can be accessed by the starting element.
  // There are two possibities
  const canAccessViewProviders = previousTView == null ?
      // 1) This is the first invocation `previousTView == null` which means that we are at the
      // `TNode` of where injector is starting to look. In such a case the only time we are allowed
      // to look into the ViewProviders is if:
      // - we are on a component
      // - AND the injector set `includeViewProviders` to true (implying that the token can see
      // ViewProviders because it is the Component or a Service which itself was declared in
      // ViewProviders)
      (isComponentHost(tNode) && includeViewProviders) :
      // 2) `previousTView != null` which means that we are now walking across the parent nodes.
      // In such a case we are only allowed to look into the ViewProviders if:
      // - We just crossed from child View to Parent View `previousTView != currentTView`
      // - AND the parent TNode is an Element.
      // This means that we just came from the Component's View and therefore are allowed to see
      // into the ViewProviders.
      (previousTView != currentTView && (tNode.type === TNodeType.Element));

  // This special case happens when there is a @host on the inject and when we are searching
  // on the host element node.
  const isHostSpecialCase = (flags & InjectFlags.Host) && hostTElementNode === tNode;

  const injectableIdx = locateDirectiveOrProvider(
      tNode, currentTView, token, canAccessViewProviders, isHostSpecialCase);
  if (injectableIdx !== null) {
    return getNodeInjectable(currentTView.data, lView, injectableIdx, tNode as TElementNode);
  } else {
    return NOT_FOUND;
  }
}

/**
 * Searches for the given token among the node's directives and providers.
 *
 * @param tNode TNode on which directives are present.
 * @param tView The tView we are currently processing
 * @param token Provider token or type of a directive to look for.
 * @param canAccessViewProviders Whether view providers should be considered.
 * @param isHostSpecialCase Whether the host special case applies.
 * @returns Index of a found directive or provider, or null when none found.
 */
export function locateDirectiveOrProvider<T>(
    tNode: TNode, tView: TView, token: Type<T>| InjectionToken<T>, canAccessViewProviders: boolean,
    isHostSpecialCase: boolean | number): number|null {
  const nodeProviderIndexes = tNode.providerIndexes;
  const tInjectables = tView.data;

  const injectablesStart = nodeProviderIndexes & TNodeProviderIndexes.ProvidersStartIndexMask;
  const directivesStart = tNode.directiveStart;
  const directiveEnd = tNode.directiveEnd;
  const cptViewProvidersCount =
      nodeProviderIndexes >> TNodeProviderIndexes.CptViewProvidersCountShift;
  const startingIndex =
      canAccessViewProviders ? injectablesStart : injectablesStart + cptViewProvidersCount;
  // When the host special case applies, only the viewProviders and the component are visible
  const endIndex = isHostSpecialCase ? injectablesStart + cptViewProvidersCount : directiveEnd;
  for (let i = startingIndex; i < endIndex; i++) {
    const providerTokenOrDef = tInjectables[i] as InjectionToken<any>| Type<any>| DirectiveDef<any>;
    if (i < directivesStart && token === providerTokenOrDef ||
        i >= directivesStart && (providerTokenOrDef as DirectiveDef<any>).type === token) {
      return i;
    }
  }
  if (isHostSpecialCase) {
    const dirDef = tInjectables[directivesStart] as DirectiveDef<any>;
    if (dirDef && isComponentDef(dirDef) && dirDef.type === token) {
      return directivesStart;
    }
  }
  return null;
}

/**
* Retrieve or instantiate the injectable from the `lData` at particular `index`.
*
* This function checks to see if the value has already been instantiated and if so returns the
* cached `injectable`. Otherwise if it detects that the value is still a factory it
* instantiates the `injectable` and caches the value.
*/
export function getNodeInjectable(
    tData: TData, lView: LView, index: number, tNode: TDirectiveHostNode): any {
  let value = lView[index];
  if (isFactory(value)) {
    const factory: NodeInjectorFactory = value;
    if (factory.resolving) {
      throw new Error(`Circular dep for ${stringifyForError(tData[index])}`);
    }
    const previousIncludeViewProviders = setIncludeViewProviders(factory.canSeeViewProviders);
    factory.resolving = true;
    let previousInjectImplementation;
    if (factory.injectImpl) {
      previousInjectImplementation = setInjectImplementation(factory.injectImpl);
    }
    enterDI(lView, tNode);
    try {
      value = lView[index] = factory.factory(undefined, tData, lView, tNode);
    } finally {
      if (factory.injectImpl) setInjectImplementation(previousInjectImplementation);
      setIncludeViewProviders(previousIncludeViewProviders);
      factory.resolving = false;
      leaveDI();
    }
  }
  return value;
}

/**
 * Returns the bit in an injector's bloom filter that should be used to determine whether or not
 * the directive might be provided by the injector.
 *
 * When a directive is public, it is added to the bloom filter and given a unique ID that can be
 * retrieved on the Type. When the directive isn't public or the token is not a directive `null`
 * is returned as the node injector can not possibly provide that token.
 *
 * @param token the injection token
 * @returns the matching bit to check in the bloom filter or `null` if the token is not known.
 *   When the returned value is negative then it represents special values such as `Injector`.
 */
export function bloomHashBitOrFactory(token: Type<any>| InjectionToken<any>| string): number|
    Function|undefined {
  ngDevMode && assertDefined(token, 'token must be defined');
  if (typeof token === 'string') {
    return token.charCodeAt(0) || 0;
  }
  const tokenId: number|undefined = (token as any)[NG_ELEMENT_ID];
  // Negative token IDs are used for special objects such as `Injector`
  return (typeof tokenId === 'number' && tokenId > 0) ? tokenId & BLOOM_MASK : tokenId;
}

export function bloomHasToken(
    bloomHash: number, injectorIndex: number, injectorView: LView | TData) {
  // Create a mask that targets the specific bit associated with the directive we're looking for.
  // JS bit operations are 32 bits, so this will be a number between 2^0 and 2^31, corresponding
  // to bit positions 0 - 31 in a 32 bit integer.
  const mask = 1 << bloomHash;
  const b7 = bloomHash & 0x80;
  const b6 = bloomHash & 0x40;
  const b5 = bloomHash & 0x20;

  // Our bloom filter size is 256 bits, which is eight 32-bit bloom filter buckets:
  // bf0 = [0 - 31], bf1 = [32 - 63], bf2 = [64 - 95], bf3 = [96 - 127], etc.
  // Get the bloom filter value from the appropriate bucket based on the directive's bloomBit.
  let value: number;

  if (b7) {
    value = b6 ? (b5 ? injectorView[injectorIndex + 7] : injectorView[injectorIndex + 6]) :
                 (b5 ? injectorView[injectorIndex + 5] : injectorView[injectorIndex + 4]);
  } else {
    value = b6 ? (b5 ? injectorView[injectorIndex + 3] : injectorView[injectorIndex + 2]) :
                 (b5 ? injectorView[injectorIndex + 1] : injectorView[injectorIndex]);
  }

  // If the bloom filter value has the bit corresponding to the directive's bloomBit flipped on,
  // this injector is a potential match.
  return !!(value & mask);
}

/** Returns true if flags prevent parent injector from being searched for tokens */
function shouldSearchParent(flags: InjectFlags, isFirstHostTNode: boolean): boolean|number {
  return !(flags & InjectFlags.Self) && !(flags & InjectFlags.Host && isFirstHostTNode);
}

export class NodeInjector implements Injector {
  constructor(
      private _tNode: TElementNode|TContainerNode|TElementContainerNode|null,
      private _lView: LView) {}

  get(token: any, notFoundValue?: any): any {
    return getOrCreateInjectable(this._tNode, this._lView, token, undefined, notFoundValue);
  }
}

/**
 * @codeGenApi
 */
export function ɵɵgetFactoryOf<T>(type: Type<any>): FactoryFn<T>|null {
  const typeAny = type as any;

  if (isForwardRef(type)) {
    return (() => {
      const factory = ɵɵgetFactoryOf<T>(resolveForwardRef(typeAny));
      return factory ? factory() : null;
    }) as any;
  }

  let factory = getFactoryDef<T>(typeAny);
  if (factory === null) {
    const injectorDef = getInjectorDef<T>(typeAny);
    factory = injectorDef && injectorDef.factory;
  }
  return factory || null;
}

/**
 * @codeGenApi
 */
export function ɵɵgetInheritedFactory<T>(type: Type<any>): (type: Type<T>) => T {
  const proto = Object.getPrototypeOf(type.prototype).constructor as Type<any>;
  const factory = (proto as any)[NG_FACTORY_DEF] || ɵɵgetFactoryOf<T>(proto);
  if (factory !== null) {
    return factory;
  } else {
    // There is no factory defined. Either this was improper usage of inheritance
    // (no Angular decorator on the superclass) or there is no constructor at all
    // in the inheritance chain. Since the two cases cannot be distinguished, the
    // latter has to be assumed.
    return (t) => new t();
  }
}
