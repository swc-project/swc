/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {R3DirectiveMetadataFacade, getCompilerFacade} from '../../compiler/compiler_facade';
import {R3ComponentMetadataFacade, R3QueryMetadataFacade} from '../../compiler/compiler_facade_interface';
import {resolveForwardRef} from '../../di/forward_ref';
import {getReflect, reflectDependencies} from '../../di/jit/util';
import {Type} from '../../interface/type';
import {Query} from '../../metadata/di';
import {Component, Directive, Input} from '../../metadata/directives';
import {componentNeedsResolution, maybeQueueResolutionOfComponentResources} from '../../metadata/resource_loading';
import {ViewEncapsulation} from '../../metadata/view';
import {initNgDevMode} from '../../util/ng_dev_mode';
import {getComponentDef, getDirectiveDef} from '../definition';
import {EMPTY_ARRAY, EMPTY_OBJ} from '../empty';
import {NG_COMP_DEF, NG_DIR_DEF, NG_FACTORY_DEF} from '../fields';
import {ComponentType} from '../interfaces/definition';
import {stringifyForError} from '../util/misc_utils';

import {angularCoreEnv} from './environment';
import {flushModuleScopingQueueAsMuchAsPossible, patchComponentDefWithScope, transitiveScopesFor} from './module';



/**
 * Compile an Angular component according to its decorator metadata, and patch the resulting
 * component def (ɵcmp) onto the component type.
 *
 * Compilation may be asynchronous (due to the need to resolve URLs for the component template or
 * other resources, for example). In the event that compilation is not immediate, `compileComponent`
 * will enqueue resource resolution into a global queue and will fail to return the `ɵcmp`
 * until the global queue has been resolved with a call to `resolveComponentResources`.
 */
export function compileComponent(type: Type<any>, metadata: Component): void {
  // Initialize ngDevMode. This must be the first statement in compileComponent.
  // See the `initNgDevMode` docstring for more information.
  (typeof ngDevMode === 'undefined' || ngDevMode) && initNgDevMode();

  let ngComponentDef: any = null;

  // Metadata may have resources which need to be resolved.
  maybeQueueResolutionOfComponentResources(type, metadata);

  // Note that we're using the same function as `Directive`, because that's only subset of metadata
  // that we need to create the ngFactoryDef. We're avoiding using the component metadata
  // because we'd have to resolve the asynchronous templates.
  addDirectiveFactoryDef(type, metadata);

  Object.defineProperty(type, NG_COMP_DEF, {
    get: () => {
      if (ngComponentDef === null) {
        const compiler = getCompilerFacade();

        if (componentNeedsResolution(metadata)) {
          const error = [`Component '${type.name}' is not resolved:`];
          if (metadata.templateUrl) {
            error.push(` - templateUrl: ${metadata.templateUrl}`);
          }
          if (metadata.styleUrls && metadata.styleUrls.length) {
            error.push(` - styleUrls: ${JSON.stringify(metadata.styleUrls)}`);
          }
          error.push(`Did you run and wait for 'resolveComponentResources()'?`);
          throw new Error(error.join('\n'));
        }

        const templateUrl = metadata.templateUrl || `ng:///${type.name}/template.html`;
        const meta: R3ComponentMetadataFacade = {
          ...directiveMetadata(type, metadata),
          typeSourceSpan: compiler.createParseSourceSpan('Component', type.name, templateUrl),
          template: metadata.template || '',
          preserveWhitespaces: metadata.preserveWhitespaces || false,
          styles: metadata.styles || EMPTY_ARRAY,
          animations: metadata.animations,
          directives: [],
          changeDetection: metadata.changeDetection,
          pipes: new Map(),
          encapsulation: metadata.encapsulation || ViewEncapsulation.Emulated,
          interpolation: metadata.interpolation,
          viewProviders: metadata.viewProviders || null,
        };
        if (meta.usesInheritance) {
          addDirectiveDefToUndecoratedParents(type);
        }

        ngComponentDef = compiler.compileComponent(angularCoreEnv, templateUrl, meta);

        // When NgModule decorator executed, we enqueued the module definition such that
        // it would only dequeue and add itself as module scope to all of its declarations,
        // but only if  if all of its declarations had resolved. This call runs the check
        // to see if any modules that are in the queue can be dequeued and add scope to
        // their declarations.
        flushModuleScopingQueueAsMuchAsPossible();

        // If component compilation is async, then the @NgModule annotation which declares the
        // component may execute and set an ngSelectorScope property on the component type. This
        // allows the component to patch itself with directiveDefs from the module after it
        // finishes compiling.
        if (hasSelectorScope(type)) {
          const scopes = transitiveScopesFor(type.ngSelectorScope);
          patchComponentDefWithScope(ngComponentDef, scopes);
        }
      }
      return ngComponentDef;
    },
    // Make the property configurable in dev mode to allow overriding in tests
    configurable: !!ngDevMode,
  });
}

function hasSelectorScope<T>(component: Type<T>): component is Type<T>&
    {ngSelectorScope: Type<any>} {
  return (component as{ngSelectorScope?: any}).ngSelectorScope !== undefined;
}

/**
 * Compile an Angular directive according to its decorator metadata, and patch the resulting
 * directive def onto the component type.
 *
 * In the event that compilation is not immediate, `compileDirective` will return a `Promise` which
 * will resolve when compilation completes and the directive becomes usable.
 */
export function compileDirective(type: Type<any>, directive: Directive | null): void {
  let ngDirectiveDef: any = null;

  addDirectiveFactoryDef(type, directive || {});

  Object.defineProperty(type, NG_DIR_DEF, {
    get: () => {
      if (ngDirectiveDef === null) {
        // `directive` can be null in the case of abstract directives as a base class
        // that use `@Directive()` with no selector. In that case, pass empty object to the
        // `directiveMetadata` function instead of null.
        const meta = getDirectiveMetadata(type, directive || {});
        ngDirectiveDef =
            getCompilerFacade().compileDirective(angularCoreEnv, meta.sourceMapUrl, meta.metadata);
      }
      return ngDirectiveDef;
    },
    // Make the property configurable in dev mode to allow overriding in tests
    configurable: !!ngDevMode,
  });
}

function getDirectiveMetadata(type: Type<any>, metadata: Directive) {
  const name = type && type.name;
  const sourceMapUrl = `ng:///${name}/ɵdir.js`;
  const compiler = getCompilerFacade();
  const facade = directiveMetadata(type as ComponentType<any>, metadata);
  facade.typeSourceSpan = compiler.createParseSourceSpan('Directive', name, sourceMapUrl);
  if (facade.usesInheritance) {
    addDirectiveDefToUndecoratedParents(type);
  }
  return {metadata: facade, sourceMapUrl};
}

function addDirectiveFactoryDef(type: Type<any>, metadata: Directive | Component) {
  let ngFactoryDef: any = null;

  Object.defineProperty(type, NG_FACTORY_DEF, {
    get: () => {
      if (ngFactoryDef === null) {
        const meta = getDirectiveMetadata(type, metadata);
        const compiler = getCompilerFacade();
        ngFactoryDef = compiler.compileFactory(angularCoreEnv, `ng:///${type.name}/ɵfac.js`, {
          ...meta.metadata,
          injectFn: 'directiveInject',
          target: compiler.R3FactoryTarget.Directive
        });
      }
      return ngFactoryDef;
    },
    // Make the property configurable in dev mode to allow overriding in tests
    configurable: !!ngDevMode,
  });
}

export function extendsDirectlyFromObject(type: Type<any>): boolean {
  return Object.getPrototypeOf(type.prototype) === Object.prototype;
}

/**
 * Extract the `R3DirectiveMetadata` for a particular directive (either a `Directive` or a
 * `Component`).
 */
export function directiveMetadata(type: Type<any>, metadata: Directive): R3DirectiveMetadataFacade {
  // Reflect inputs and outputs.
  const propMetadata = getReflect().ownPropMetadata(type);

  return {
    name: type.name,
    type: type,
    typeArgumentCount: 0,
    selector: metadata.selector !== undefined ? metadata.selector : null,
    deps: reflectDependencies(type),
    host: metadata.host || EMPTY_OBJ,
    propMetadata: propMetadata,
    inputs: metadata.inputs || EMPTY_ARRAY,
    outputs: metadata.outputs || EMPTY_ARRAY,
    queries: extractQueriesMetadata(type, propMetadata, isContentQuery),
    lifecycle: {usesOnChanges: usesLifecycleHook(type, 'ngOnChanges')},
    typeSourceSpan: null !,
    usesInheritance: !extendsDirectlyFromObject(type),
    exportAs: extractExportAs(metadata.exportAs),
    providers: metadata.providers || null,
    viewQueries: extractQueriesMetadata(type, propMetadata, isViewQuery)
  };
}

/**
 * Adds a directive definition to all parent classes of a type that don't have an Angular decorator.
 */
function addDirectiveDefToUndecoratedParents(type: Type<any>) {
  const objPrototype = Object.prototype;
  let parent = Object.getPrototypeOf(type);

  // Go up the prototype until we hit `Object`.
  while (parent && parent !== objPrototype) {
    // Since inheritance works if the class was annotated already, we only need to add
    // the def if there are no annotations and the def hasn't been created already.
    if (!getDirectiveDef(parent) && !getComponentDef(parent) &&
        shouldAddAbstractDirective(parent)) {
      compileDirective(parent, null);
    }
    parent = Object.getPrototypeOf(parent);
  }
}

function convertToR3QueryPredicate(selector: any): any|string[] {
  return typeof selector === 'string' ? splitByComma(selector) : resolveForwardRef(selector);
}

export function convertToR3QueryMetadata(propertyName: string, ann: Query): R3QueryMetadataFacade {
  return {
    propertyName: propertyName,
    predicate: convertToR3QueryPredicate(ann.selector),
    descendants: ann.descendants,
    first: ann.first,
    read: ann.read ? ann.read : null,
    static: !!ann.static
  };
}
function extractQueriesMetadata(
    type: Type<any>, propMetadata: {[key: string]: any[]},
    isQueryAnn: (ann: any) => ann is Query): R3QueryMetadataFacade[] {
  const queriesMeta: R3QueryMetadataFacade[] = [];
  for (const field in propMetadata) {
    if (propMetadata.hasOwnProperty(field)) {
      const annotations = propMetadata[field];
      annotations.forEach(ann => {
        if (isQueryAnn(ann)) {
          if (!ann.selector) {
            throw new Error(
                `Can't construct a query for the property "${field}" of ` +
                `"${stringifyForError(type)}" since the query selector wasn't defined.`);
          }
          if (annotations.some(isInputAnnotation)) {
            throw new Error(`Cannot combine @Input decorators with query decorators`);
          }
          queriesMeta.push(convertToR3QueryMetadata(field, ann));
        }
      });
    }
  }
  return queriesMeta;
}

function extractExportAs(exportAs: string | undefined): string[]|null {
  return exportAs === undefined ? null : splitByComma(exportAs);
}

function isContentQuery(value: any): value is Query {
  const name = value.ngMetadataName;
  return name === 'ContentChild' || name === 'ContentChildren';
}

function isViewQuery(value: any): value is Query {
  const name = value.ngMetadataName;
  return name === 'ViewChild' || name === 'ViewChildren';
}

function isInputAnnotation(value: any): value is Input {
  return value.ngMetadataName === 'Input';
}

function splitByComma(value: string): string[] {
  return value.split(',').map(piece => piece.trim());
}

function usesLifecycleHook(type: Type<any>, name: string): boolean {
  const prototype = type.prototype;
  return prototype && prototype.hasOwnProperty(name);
}

const LIFECYCLE_HOOKS = [
  'ngOnChanges', 'ngOnInit', 'ngOnDestroy', 'ngDoCheck', 'ngAfterViewInit', 'ngAfterViewChecked',
  'ngAfterContentInit', 'ngAfterContentChecked'
];

function shouldAddAbstractDirective(type: Type<any>): boolean {
  if (LIFECYCLE_HOOKS.some(hookName => usesLifecycleHook(type, hookName))) {
    return true;
  }

  const propMetadata = getReflect().ownPropMetadata(type);

  for (const field in propMetadata) {
    const annotations = propMetadata[field];

    for (let i = 0; i < annotations.length; i++) {
      const current = annotations[i];
      const metadataName = current.ngMetadataName;

      if (isInputAnnotation(current) || isContentQuery(current) || isViewQuery(current) ||
          metadataName === 'Output' || metadataName === 'HostBinding' ||
          metadataName === 'HostListener') {
        return true;
      }
    }
  }

  return false;
}
