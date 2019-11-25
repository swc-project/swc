/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Type} from '../../interface/type';

/**
 * Configures the `Injector` to return a value for a token.
 * Base for `ValueProvider` decorator.
 *
 * @publicApi
 */
export interface ValueSansProvider {
  /**
   * The value to inject.
   */
  useValue: any;
}

/**
 * Configures the `Injector` to return a value for a token.
 * @see ["Dependency Injection Guide"](guide/dependency-injection).
 *
 * @usageNotes
 *
 * ### Example
 *
 * {@example core/di/ts/provider_spec.ts region='ValueProvider'}
 *
 * ### Multi-value example
 *
 * {@example core/di/ts/provider_spec.ts region='MultiProviderAspect'}
 *
 * @publicApi
 */
export interface ValueProvider extends ValueSansProvider {
  /**
   * An injection token. Typically an instance of `Type` or `InjectionToken`, but can be `any`.
   */
  provide: any;

  /**
   * When true, injector returns an array of instances. This is useful to allow multiple
   * providers spread across many files to provide configuration information to a common token.
   */
  multi?: boolean;
}

/**
 * Configures the `Injector` to return an instance of `useClass` for a token.
 * Base for `StaticClassProvider` decorator.
 *
 * @publicApi
 */
export interface StaticClassSansProvider {
  /**
   * An optional class to instantiate for the `token`. By default, the `provide`
   * class is instantiated.
   */
  useClass: Type<any>;

  /**
   * A list of `token`s to be resolved by the injector. The list of values is then
   * used as arguments to the `useClass` constructor.
   */
  deps: any[];
}

/**
 * Configures the `Injector` to return an instance of `useClass` for a token.
 * @see ["Dependency Injection Guide"](guide/dependency-injection).
 *
 * @usageNotes
 *
 * {@example core/di/ts/provider_spec.ts region='StaticClassProvider'}
 *
 * Note that following two providers are not equal:
 *
 * {@example core/di/ts/provider_spec.ts region='StaticClassProviderDifference'}
 *
 * ### Multi-value example
 *
 * {@example core/di/ts/provider_spec.ts region='MultiProviderAspect'}
 *
 * @publicApi
 */
export interface StaticClassProvider extends StaticClassSansProvider {
  /**
   * An injection token. Typically an instance of `Type` or `InjectionToken`, but can be `any`.
   */
  provide: any;

  /**
   * When true, injector returns an array of instances. This is useful to allow multiple
   * providers spread across many files to provide configuration information to a common token.
   */
  multi?: boolean;
}

/**
 * Configures the `Injector` to return an instance of a token.
 *
 * @see ["Dependency Injection Guide"](guide/dependency-injection).
 *
 * @usageNotes
 *
 * ```ts
 * @Injectable(SomeModule, {deps: []})
 * class MyService {}
 * ```
 *
 * @publicApi
 */
export interface ConstructorSansProvider {
  /**
   * A list of `token`s to be resolved by the injector.
   */
  deps?: any[];
}

/**
 * Configures the `Injector` to return an instance of a token.
 *
 * @see ["Dependency Injection Guide"](guide/dependency-injection).
 *
 * @usageNotes
 *
 * {@example core/di/ts/provider_spec.ts region='ConstructorProvider'}
 *
 * ### Multi-value example
 *
 * {@example core/di/ts/provider_spec.ts region='MultiProviderAspect'}
 *
 * @publicApi
 */
export interface ConstructorProvider extends ConstructorSansProvider {
  /**
   * An injection token. Typically an instance of `Type` or `InjectionToken`, but can be `any`.
   */
  provide: Type<any>;

  /**
   * When true, injector returns an array of instances. This is useful to allow multiple
   * providers spread across many files to provide configuration information to a common token.
   */
  multi?: boolean;
}

/**
 * Configures the `Injector` to return a value of another `useExisting` token.
 *
 * @see `ExistingProvider`
 * @see ["Dependency Injection Guide"](guide/dependency-injection).
 *
 * @publicApi
 */
export interface ExistingSansProvider {
  /**
   * Existing `token` to return. (Equivalent to `injector.get(useExisting)`)
   */
  useExisting: any;
}

/**
 * Configures the `Injector` to return a value of another `useExisting` token.
 *
 * @see ["Dependency Injection Guide"](guide/dependency-injection).
 *
 * @usageNotes
 *
 * {@example core/di/ts/provider_spec.ts region='ExistingProvider'}
 *
 * ### Multi-value example
 *
 * {@example core/di/ts/provider_spec.ts region='MultiProviderAspect'}
 *
 * @publicApi
 */
export interface ExistingProvider extends ExistingSansProvider {
  /**
   * An injection token. Typically an instance of `Type` or `InjectionToken`, but can be `any`.
   */
  provide: any;

  /**
   * When true, injector returns an array of instances. This is useful to allow multiple
   * providers spread across many files to provide configuration information to a common token.
   */
  multi?: boolean;
}

/**
 * Configures the `Injector` to return a value by invoking a `useFactory` function.
 *
 * @see `FactoryProvider`
 * @see ["Dependency Injection Guide"](guide/dependency-injection).
 *
 * @publicApi
 */
export interface FactorySansProvider {
  /**
   * A function to invoke to create a value for this `token`. The function is invoked with
   * resolved values of `token`s in the `deps` field.
   */
  useFactory: Function;

  /**
   * A list of `token`s to be resolved by the injector. The list of values is then
   * used as arguments to the `useFactory` function.
   */
  deps?: any[];
}

/**
 * Configures the `Injector` to return a value by invoking a `useFactory` function.
 * @see ["Dependency Injection Guide"](guide/dependency-injection).
 *
 * @usageNotes
 *
 * {@example core/di/ts/provider_spec.ts region='FactoryProvider'}
 *
 * Dependencies can also be marked as optional:
 *
 * {@example core/di/ts/provider_spec.ts region='FactoryProviderOptionalDeps'}
 *
 * ### Multi-value example
 *
 * {@example core/di/ts/provider_spec.ts region='MultiProviderAspect'}
 *
 * @publicApi
 */
export interface FactoryProvider extends FactorySansProvider {
  /**
   * An injection token. (Typically an instance of `Type` or `InjectionToken`, but can be `any`).
   */
  provide: any;

  /**
   * When true, injector returns an array of instances. This is useful to allow multiple
   * providers spread across many files to provide configuration information to a common token.
   */
  multi?: boolean;
}

/**
 * Describes how the `Injector` should be configured as static (that is, without reflection).
 * @see ["Dependency Injection Guide"](guide/dependency-injection).
 *
 * @publicApi
 */
export type StaticProvider = ValueProvider | ExistingProvider | StaticClassProvider |
    ConstructorProvider | FactoryProvider | any[];


/**
 * Configures the `Injector` to return an instance of `Type` when `Type' is used as the token.
 *
 * Create an instance by invoking the `new` operator and supplying additional arguments.
 * This form is a short form of `TypeProvider`;
 *
 * For more details, see the ["Dependency Injection Guide"](guide/dependency-injection).
 *
 * @usageNotes
 *
 * {@example core/di/ts/provider_spec.ts region='TypeProvider'}
 *
 * @publicApi
 */
export interface TypeProvider extends Type<any> {}

/**
 * Configures the `Injector` to return a value by invoking a `useClass` function.
 * Base for `ClassProvider` decorator.
 *
 * @see ["Dependency Injection Guide"](guide/dependency-injection).
 *
 * @publicApi
 */
export interface ClassSansProvider {
  /**
   * Class to instantiate for the `token`.
   */
  useClass: Type<any>;
}

/**
 * Configures the `Injector` to return an instance of `useClass` for a token.
 * @see ["Dependency Injection Guide"](guide/dependency-injection).
 *
 * @usageNotes
 *
 * {@example core/di/ts/provider_spec.ts region='ClassProvider'}
 *
 * Note that following two providers are not equal:
 *
 * {@example core/di/ts/provider_spec.ts region='ClassProviderDifference'}
 *
 * ### Multi-value example
 *
 * {@example core/di/ts/provider_spec.ts region='MultiProviderAspect'}
 *
 * @publicApi
 */
export interface ClassProvider extends ClassSansProvider {
  /**
   * An injection token. (Typically an instance of `Type` or `InjectionToken`, but can be `any`).
   */
  provide: any;

  /**
   * When true, injector returns an array of instances. This is useful to allow multiple
   * providers spread across many files to provide configuration information to a common token.
   */
  multi?: boolean;
}

/**
 * Describes how the `Injector` should be configured.
 * @see ["Dependency Injection Guide"](guide/dependency-injection).
 *
 * @see `StaticProvider`
 *
 * @publicApi
 */
export type Provider = TypeProvider | ValueProvider | ClassProvider | ConstructorProvider |
    ExistingProvider | FactoryProvider | any[];

/**
 * Describes a function that is used to process provider lists (such as provider
 * overrides).
 */
export type ProcessProvidersFunction = (providers: Provider[]) => Provider[];
