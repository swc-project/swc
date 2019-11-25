/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ApplicationRef} from '../application_ref';
import {ChangeDetectorRef as viewEngine_ChangeDetectorRef} from '../change_detection/change_detector_ref';
import {ViewContainerRef as viewEngine_ViewContainerRef} from '../linker/view_container_ref';
import {EmbeddedViewRef as viewEngine_EmbeddedViewRef, InternalViewRef as viewEngine_InternalViewRef} from '../linker/view_ref';

import {checkNoChangesInRootView, checkNoChangesInternal, detectChangesInRootView, detectChangesInternal, markViewDirty, storeCleanupFn} from './instructions/shared';
import {CONTAINER_HEADER_OFFSET} from './interfaces/container';
import {TElementNode, TNode, TNodeType, TViewNode} from './interfaces/node';
import {isLContainer} from './interfaces/type_checks';
import {CONTEXT, DECLARATION_COMPONENT_VIEW, FLAGS, HOST, LView, LViewFlags, TVIEW, T_HOST} from './interfaces/view';
import {assertNodeOfPossibleTypes} from './node_assert';
import {destroyLView, renderDetachView} from './node_manipulation';
import {getLViewParent} from './util/view_traversal_utils';
import {unwrapRNode} from './util/view_utils';



// Needed due to tsickle downleveling where multiple `implements` with classes creates
// multiple @extends in Closure annotations, which is illegal. This workaround fixes
// the multiple @extends by making the annotation @implements instead
export interface viewEngine_ChangeDetectorRef_interface extends viewEngine_ChangeDetectorRef {}

export class ViewRef<T> implements viewEngine_EmbeddedViewRef<T>, viewEngine_InternalViewRef,
    viewEngine_ChangeDetectorRef_interface {
  private _appRef: ApplicationRef|null = null;
  private _viewContainerRef: viewEngine_ViewContainerRef|null = null;

  /**
   * @internal
   */
  public _tViewNode: TViewNode|null = null;

  get rootNodes(): any[] {
    if (this._lView[HOST] == null) {
      const tView = this._lView[T_HOST] as TViewNode;
      return collectNativeNodes(this._lView, tView.child, []);
    }
    return [];
  }

  constructor(
      /**
       * This represents `LView` associated with the component when ViewRef is a ChangeDetectorRef.
       *
       * When ViewRef is created for a dynamic component, this also represents the `LView` for the
       * component.
       *
       * For a "regular" ViewRef created for an embedded view, this is the `LView` for the embedded
       * view.
       *
       * @internal
       */
      public _lView: LView,

      /**
       * This represents the `LView` associated with the point where `ChangeDetectorRef` was
       * requested.
       *
       * This may be different from `_lView` if the `_cdRefInjectingView` is an embedded view.
       */
      private _cdRefInjectingView?: LView) {}

  get context(): T { return this._lView[CONTEXT] as T; }

  get destroyed(): boolean {
    return (this._lView[FLAGS] & LViewFlags.Destroyed) === LViewFlags.Destroyed;
  }

  destroy(): void {
    if (this._appRef) {
      this._appRef.detachView(this);
    } else if (this._viewContainerRef) {
      const index = this._viewContainerRef.indexOf(this);

      if (index > -1) {
        this._viewContainerRef.detach(index);
      }

      this._viewContainerRef = null;
    }
    destroyLView(this._lView);
  }

  onDestroy(callback: Function) { storeCleanupFn(this._lView, callback); }

  /**
   * Marks a view and all of its ancestors dirty.
   *
   * It also triggers change detection by calling `scheduleTick` internally, which coalesces
   * multiple `markForCheck` calls to into one change detection run.
   *
   * This can be used to ensure an {@link ChangeDetectionStrategy#OnPush OnPush} component is
   * checked when it needs to be re-rendered but the two normal triggers haven't marked it
   * dirty (i.e. inputs haven't changed and events haven't fired in the view).
   *
   * <!-- TODO: Add a link to a chapter on OnPush components -->
   *
   * @usageNotes
   * ### Example
   *
   * ```typescript
   * @Component({
   *   selector: 'my-app',
   *   template: `Number of ticks: {{numberOfTicks}}`
   *   changeDetection: ChangeDetectionStrategy.OnPush,
   * })
   * class AppComponent {
   *   numberOfTicks = 0;
   *
   *   constructor(private ref: ChangeDetectorRef) {
   *     setInterval(() => {
   *       this.numberOfTicks++;
   *       // the following is required, otherwise the view will not be updated
   *       this.ref.markForCheck();
   *     }, 1000);
   *   }
   * }
   * ```
   */
  markForCheck(): void { markViewDirty(this._cdRefInjectingView || this._lView); }

  /**
   * Detaches the view from the change detection tree.
   *
   * Detached views will not be checked during change detection runs until they are
   * re-attached, even if they are dirty. `detach` can be used in combination with
   * {@link ChangeDetectorRef#detectChanges detectChanges} to implement local change
   * detection checks.
   *
   * <!-- TODO: Add a link to a chapter on detach/reattach/local digest -->
   * <!-- TODO: Add a live demo once ref.detectChanges is merged into master -->
   *
   * @usageNotes
   * ### Example
   *
   * The following example defines a component with a large list of readonly data.
   * Imagine the data changes constantly, many times per second. For performance reasons,
   * we want to check and update the list every five seconds. We can do that by detaching
   * the component's change detector and doing a local check every five seconds.
   *
   * ```typescript
   * class DataProvider {
   *   // in a real application the returned data will be different every time
   *   get data() {
   *     return [1,2,3,4,5];
   *   }
   * }
   *
   * @Component({
   *   selector: 'giant-list',
   *   template: `
   *     <li *ngFor="let d of dataProvider.data">Data {{d}}</li>
   *   `,
   * })
   * class GiantList {
   *   constructor(private ref: ChangeDetectorRef, private dataProvider: DataProvider) {
   *     ref.detach();
   *     setInterval(() => {
   *       this.ref.detectChanges();
   *     }, 5000);
   *   }
   * }
   *
   * @Component({
   *   selector: 'app',
   *   providers: [DataProvider],
   *   template: `
   *     <giant-list><giant-list>
   *   `,
   * })
   * class App {
   * }
   * ```
   */
  detach(): void { this._lView[FLAGS] &= ~LViewFlags.Attached; }

  /**
   * Re-attaches a view to the change detection tree.
   *
   * This can be used to re-attach views that were previously detached from the tree
   * using {@link ChangeDetectorRef#detach detach}. Views are attached to the tree by default.
   *
   * <!-- TODO: Add a link to a chapter on detach/reattach/local digest -->
   *
   * @usageNotes
   * ### Example
   *
   * The following example creates a component displaying `live` data. The component will detach
   * its change detector from the main change detector tree when the component's live property
   * is set to false.
   *
   * ```typescript
   * class DataProvider {
   *   data = 1;
   *
   *   constructor() {
   *     setInterval(() => {
   *       this.data = this.data * 2;
   *     }, 500);
   *   }
   * }
   *
   * @Component({
   *   selector: 'live-data',
   *   inputs: ['live'],
   *   template: 'Data: {{dataProvider.data}}'
   * })
   * class LiveData {
   *   constructor(private ref: ChangeDetectorRef, private dataProvider: DataProvider) {}
   *
   *   set live(value) {
   *     if (value) {
   *       this.ref.reattach();
   *     } else {
   *       this.ref.detach();
   *     }
   *   }
   * }
   *
   * @Component({
   *   selector: 'my-app',
   *   providers: [DataProvider],
   *   template: `
   *     Live Update: <input type="checkbox" [(ngModel)]="live">
   *     <live-data [live]="live"><live-data>
   *   `,
   * })
   * class AppComponent {
   *   live = true;
   * }
   * ```
   */
  reattach(): void { this._lView[FLAGS] |= LViewFlags.Attached; }

  /**
   * Checks the view and its children.
   *
   * This can also be used in combination with {@link ChangeDetectorRef#detach detach} to implement
   * local change detection checks.
   *
   * <!-- TODO: Add a link to a chapter on detach/reattach/local digest -->
   * <!-- TODO: Add a live demo once ref.detectChanges is merged into master -->
   *
   * @usageNotes
   * ### Example
   *
   * The following example defines a component with a large list of readonly data.
   * Imagine, the data changes constantly, many times per second. For performance reasons,
   * we want to check and update the list every five seconds.
   *
   * We can do that by detaching the component's change detector and doing a local change detection
   * check every five seconds.
   *
   * See {@link ChangeDetectorRef#detach detach} for more information.
   */
  detectChanges(): void { detectChangesInternal(this._lView, this.context); }

  /**
   * Checks the change detector and its children, and throws if any changes are detected.
   *
   * This is used in development mode to verify that running change detection doesn't
   * introduce other changes.
   */
  checkNoChanges(): void { checkNoChangesInternal(this._lView, this.context); }

  attachToViewContainerRef(vcRef: viewEngine_ViewContainerRef) {
    if (this._appRef) {
      throw new Error('This view is already attached directly to the ApplicationRef!');
    }
    this._viewContainerRef = vcRef;
  }

  detachFromAppRef() {
    this._appRef = null;
    renderDetachView(this._lView);
  }

  attachToAppRef(appRef: ApplicationRef) {
    if (this._viewContainerRef) {
      throw new Error('This view is already attached to a ViewContainer!');
    }
    this._appRef = appRef;
  }
}

/** @internal */
export class RootViewRef<T> extends ViewRef<T> {
  constructor(public _view: LView) { super(_view); }

  detectChanges(): void { detectChangesInRootView(this._view); }

  checkNoChanges(): void { checkNoChangesInRootView(this._view); }

  get context(): T { return null !; }
}

function collectNativeNodes(
    lView: LView, tNode: TNode | null, result: any[], isProjection: boolean = false): any[] {
  while (tNode !== null) {
    ngDevMode && assertNodeOfPossibleTypes(
                     tNode, TNodeType.Element, TNodeType.Container, TNodeType.Projection,
                     TNodeType.ElementContainer, TNodeType.IcuContainer);

    const lNode = lView[tNode.index];
    if (lNode !== null) {
      result.push(unwrapRNode(lNode));
    }

    // A given lNode can represent either a native node or a LContainer (when it is a host of a
    // ViewContainerRef). When we find a LContainer we need to descend into it to collect root nodes
    // from the views in this container.
    if (isLContainer(lNode)) {
      for (let i = CONTAINER_HEADER_OFFSET; i < lNode.length; i++) {
        const lViewInAContainer = lNode[i];
        const lViewFirstChildTNode = lViewInAContainer[TVIEW].firstChild;
        if (lViewFirstChildTNode !== null) {
          collectNativeNodes(lViewInAContainer, lViewFirstChildTNode, result);
        }
      }
    }

    const tNodeType = tNode.type;
    if (tNodeType === TNodeType.ElementContainer || tNodeType === TNodeType.IcuContainer) {
      collectNativeNodes(lView, tNode.child, result);
    } else if (tNodeType === TNodeType.Projection) {
      const componentView = lView[DECLARATION_COMPONENT_VIEW];
      const componentHost = componentView[T_HOST] as TElementNode;
      const parentView = getLViewParent(componentView);
      let firstProjectedNode: TNode|null =
          (componentHost.projection as(TNode | null)[])[tNode.projection as number];
      if (firstProjectedNode !== null && parentView !== null) {
        collectNativeNodes(parentView, firstProjectedNode, result, true);
      }
    }
    tNode = isProjection ? tNode.projectionNext : tNode.next;
  }

  return result;
}
