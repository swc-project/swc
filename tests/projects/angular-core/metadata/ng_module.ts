/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ApplicationRef} from '../application_ref';
import {InjectorType, ɵɵdefineInjector} from '../di/interface/defs';
import {Provider} from '../di/interface/provider';
import {convertInjectableProviderToFactory} from '../di/util';
import {Type} from '../interface/type';
import {SchemaMetadata} from '../metadata/schema';
import {NgModuleType} from '../render3';
import {compileNgModule as render3CompileNgModule} from '../render3/jit/module';
import {TypeDecorator, makeDecorator} from '../util/decorators';


/**
 * Represents the expansion of an `NgModule` into its scopes.
 *
 * A scope is a set of directives and pipes that are visible in a particular context. Each
 * `NgModule` has two scopes. The `compilation` scope is the set of directives and pipes that will
 * be recognized in the templates of components declared by the module. The `exported` scope is the
 * set of directives and pipes exported by a module (that is, module B's exported scope gets added
 * to module A's compilation scope when module A imports B).
 */
export interface NgModuleTransitiveScopes {
  compilation: {directives: Set<any>; pipes: Set<any>;};
  exported: {directives: Set<any>; pipes: Set<any>;};
  schemas: SchemaMetadata[]|null;
}

/**
 * @publicApi
 */
export type ɵɵNgModuleDefWithMeta<T, Declarations, Imports, Exports> = NgModuleDef<T>;

/**
 * Runtime link information for NgModules.
 *
 * This is the internal data structure used by the runtime to assemble components, directives,
 * pipes, and injectors.
 *
 * NOTE: Always use `ɵɵdefineNgModule` function to create this object,
 * never create the object directly since the shape of this object
 * can change between versions.
 */
export interface NgModuleDef<T> {
  /** Token representing the module. Used by DI. */
  type: T;

  /** List of components to bootstrap. */
  bootstrap: Type<any>[]|(() => Type<any>[]);

  /** List of components, directives, and pipes declared by this module. */
  declarations: Type<any>[]|(() => Type<any>[]);

  /** List of modules or `ModuleWithProviders` imported by this module. */
  imports: Type<any>[]|(() => Type<any>[]);

  /**
   * List of modules, `ModuleWithProviders`, components, directives, or pipes exported by this
   * module.
   */
  exports: Type<any>[]|(() => Type<any>[]);

  /**
   * Cached value of computed `transitiveCompileScopes` for this module.
   *
   * This should never be read directly, but accessed via `transitiveScopesFor`.
   */
  transitiveCompileScopes: NgModuleTransitiveScopes|null;

  /** The set of schemas that declare elements to be allowed in the NgModule. */
  schemas: SchemaMetadata[]|null;

  /** Unique ID for the module with which it should be registered.  */
  id: string|null;
}

/**
 * A wrapper around an NgModule that associates it with the providers.
 *
 * @param T the module type. In Ivy applications, this must be explicitly
 * provided.
 *
 * Note that using ModuleWithProviders without a generic type is deprecated.
 * The generic will become required in a future version of Angular.
 *
 * @publicApi
 */
export interface ModuleWithProviders<
    T = any /** TODO(alxhub): remove default when callers pass explicit type param */> {
  ngModule: Type<T>;
  providers?: Provider[];
}


/**
 * Type of the NgModule decorator / constructor function.
 *
 * @publicApi
 */
export interface NgModuleDecorator {
  /**
   * Decorator that marks a class as an NgModule and supplies configuration metadata.
   */
  (obj?: NgModule): TypeDecorator;
  new (obj?: NgModule): NgModule;
}

/**
 * Type of the NgModule metadata.
 *
 * @publicApi
 */
export interface NgModule {
  /**
   * The set of injectable objects that are available in the injector
   * of this module.
   *
   * @see [Dependency Injection guide](guide/dependency-injection)
   * @see [NgModule guide](guide/providers)
   *
   * @usageNotes
   *
   * Dependencies whose providers are listed here become available for injection
   * into any component, directive, pipe or service that is a child of this injector.
   * The NgModule used for bootstrapping uses the root injector, and can provide dependencies
   * to any part of the app.
   *
   * A lazy-loaded module has its own injector, typically a child of the app root injector.
   * Lazy-loaded services are scoped to the lazy-loaded module's injector.
   * If a lazy-loaded module also provides the `UserService`, any component created
   * within that module's context (such as by router navigation) gets the local instance
   * of the service, not the instance in the root injector.
   * Components in external modules continue to receive the instance provided by their injectors.
   *
   * ### Example
   *
   * The following example defines a class that is injected in
   * the HelloWorld NgModule:
   *
   * ```
   * class Greeter {
   *    greet(name:string) {
   *      return 'Hello ' + name + '!';
   *    }
   * }
   *
   * @NgModule({
   *   providers: [
   *     Greeter
   *   ]
   * })
   * class HelloWorld {
   *   greeter:Greeter;
   *
   *   constructor(greeter:Greeter) {
   *     this.greeter = greeter;
   *   }
   * }
   * ```
   */
  providers?: Provider[];

  /**
   * The set of components, directives, and pipes ([declarables](guide/glossary#declarable))
   * that belong to this module.
   *
   * @usageNotes
   *
   * The set of selectors that are available to a template include those declared here, and
   * those that are exported from imported NgModules.
   *
   * Declarables must belong to exactly one module.
   * The compiler emits an error if you try to declare the same class in more than one module.
   * Be careful not to declare a class that is imported from another module.
   *
   * ### Example
   *
   * The following example allows the CommonModule to use the `NgFor`
   * directive.
   *
   * ```javascript
   * @NgModule({
   *   declarations: [NgFor]
   * })
   * class CommonModule {
   * }
   * ```
   */
  declarations?: Array<Type<any>|any[]>;

  /**
   * The set of NgModules whose exported [declarables](guide/glossary#declarable)
   * are available to templates in this module.
   *
   * @usageNotes
   *
   * A template can use exported declarables from any
   * imported module, including those from modules that are imported indirectly
   * and re-exported.
   * For example, `ModuleA` imports `ModuleB`, and also exports
   * it, which makes the declarables from `ModuleB` available
   * wherever `ModuleA` is imported.
   *
   * ### Example
   *
   * The following example allows MainModule to use anything exported by
   * `CommonModule`:
   *
   * ```javascript
   * @NgModule({
   *   imports: [CommonModule]
   * })
   * class MainModule {
   * }
   * ```
   *
   */
  imports?: Array<Type<any>|ModuleWithProviders<{}>|any[]>;

  /**
   * The set of components, directives, and pipes declared in this
   * NgModule that can be used in the template of any component that is part of an
   * NgModule that imports this NgModule. Exported declarations are the module's public API.
   *
   * A declarable belongs to one and only one NgModule.
   * A module can list another module among its exports, in which case all of that module's
   * public declaration are exported.
   *
   * @usageNotes
   *
   * Declarations are private by default.
   * If this ModuleA does not export UserComponent, then only the components within this
   * ModuleA can use UserComponent.
   *
   * ModuleA can import ModuleB and also export it, making exports from ModuleB
   * available to an NgModule that imports ModuleA.
   *
   * ### Example
   *
   * The following example exports the `NgFor` directive from CommonModule.
   *
   * ```javascript
   * @NgModule({
   *   exports: [NgFor]
   * })
   * class CommonModule {
   * }
   * ```
   */
  exports?: Array<Type<any>|any[]>;

  /**
   * The set of components to compile when this NgModule is defined,
   * so that they can be dynamically loaded into the view.
   *
   * For each component listed here, Angular creates a `ComponentFactory`
   * and stores it in the `ComponentFactoryResolver`.
   *
   * Angular automatically adds components in the module's bootstrap
   * and route definitions into the `entryComponents` list. Use this
   * option to add components that are bootstrapped
   * using one of the imperative techniques, such as `ViewContainerRef.createComponent()`.
   *
   * @see [Entry Components](guide/entry-components)
   * @deprecated Since 9.0.0. With Ivy, this property is no longer necessary.
   */
  entryComponents?: Array<Type<any>|any[]>;

  /**
   * The set of components that are bootstrapped when
   * this module is bootstrapped. The components listed here
   * are automatically added to `entryComponents`.
   */
  bootstrap?: Array<Type<any>|any[]>;

  /**
   * The set of schemas that declare elements to be allowed in the NgModule.
   * Elements and properties that are neither Angular components nor directives
   * must be declared in a schema.
   *
   * Allowed value are `NO_ERRORS_SCHEMA` and `CUSTOM_ELEMENTS_SCHEMA`.
   *
   * @security When using one of `NO_ERRORS_SCHEMA` or `CUSTOM_ELEMENTS_SCHEMA`
   * you must ensure that allowed elements and properties securely escape inputs.
   */
  schemas?: Array<SchemaMetadata|any[]>;

  /**
   * A name or path that uniquely identifies this NgModule in `getModuleFactory`.
   * If left `undefined`, the NgModule is not registered with
   * `getModuleFactory`.
   */
  id?: string;

  /**
   * If true, this module will be skipped by the AOT compiler and so will always be compiled
   * using JIT.
   *
   * This exists to support future Ivy work and has no effect currently.
   */
  jit?: true;
}

/**
 * @Annotation
 * @publicApi
 */
export const NgModule: NgModuleDecorator = makeDecorator(
    'NgModule', (ngModule: NgModule) => ngModule, undefined, undefined,
    /**
     * Decorator that marks the following class as an NgModule, and supplies
     * configuration metadata for it.
     *
     * * The `declarations` and `entryComponents` options configure the compiler
     * with information about what belongs to the NgModule.
     * * The `providers` options configures the NgModule's injector to provide
     * dependencies the NgModule members.
     * * The `imports` and `exports` options bring in members from other modules, and make
     * this module's members available to others.
     */
    (type: Type<any>, meta: NgModule) => SWITCH_COMPILE_NGMODULE(type, meta));

/**
 * @description
 * Hook for manual bootstrapping of the application instead of using bootstrap array in @NgModule
 * annotation.
 *
 * Reference to the current application is provided as a parameter.
 *
 * See ["Bootstrapping"](guide/bootstrapping) and ["Entry components"](guide/entry-components).
 *
 * @usageNotes
 * ```typescript
 * class AppModule implements DoBootstrap {
 *   ngDoBootstrap(appRef: ApplicationRef) {
 *     appRef.bootstrap(AppComponent); // Or some other component
 *   }
 * }
 * ```
 *
 * @publicApi
 */
export interface DoBootstrap { ngDoBootstrap(appRef: ApplicationRef): void; }

function preR3NgModuleCompile(moduleType: Type<any>, metadata?: NgModule): void {
  let imports = (metadata && metadata.imports) || [];
  if (metadata && metadata.exports) {
    imports = [...imports, metadata.exports];
  }

  (moduleType as InjectorType<any>).ɵinj = ɵɵdefineInjector({
    factory: convertInjectableProviderToFactory(moduleType, {useClass: moduleType}),
    providers: metadata && metadata.providers,
    imports: imports,
  });
}


export const SWITCH_COMPILE_NGMODULE__POST_R3__ = render3CompileNgModule;
const SWITCH_COMPILE_NGMODULE__PRE_R3__ = preR3NgModuleCompile;
const SWITCH_COMPILE_NGMODULE: typeof render3CompileNgModule = SWITCH_COMPILE_NGMODULE__PRE_R3__;
