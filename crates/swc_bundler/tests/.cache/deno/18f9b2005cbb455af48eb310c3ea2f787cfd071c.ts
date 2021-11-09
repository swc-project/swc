// Loaded from https://deno.land/x/dso@v1.0.0/src/Reflect.ts


// @ts-nocheck
/*! *****************************************************************************
Copyright (C) Microsoft. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0
THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.
See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
namespace Reflect {
  // Metadata Proposal
  // https://rbuckton.github.io/reflect-metadata/

  type HashMap<V> = Record<string, V>;

  interface BufferLike {
    [offset: number]: number;
    length: number;
  }

  type IteratorResult<T> =
    | { value: T; done: false }
    | { value: never; done: true };

  interface Iterator<T> {
    next(value?: any): IteratorResult<T>;
    throw?(value: any): IteratorResult<T>;
    return?(value?: T): IteratorResult<T>;
  }

  interface Iterable<T> {
    "@@iterator"(): Iterator<T>;
  }

  interface IterableIterator<T> extends Iterator<T> {
    "@@iterator"(): IterableIterator<T>;
  }

  interface Map<K, V> extends Iterable<[K, V]> {
    size: number;
    has(key: K): boolean;
    get(key: K): V;
    set(key: K, value?: V): this;
    delete(key: K): boolean;
    clear(): void;
    keys(): IterableIterator<K>;
    values(): IterableIterator<V>;
    entries(): IterableIterator<[K, V]>;
  }

  interface MapConstructor {
    new (): Map<any, any>;
    new <K, V>(): Map<K, V>;
    prototype: Map<any, any>;
  }

  interface Set<T> extends Iterable<T> {
    size: number;
    has(value: T): boolean;
    add(value: T): this;
    delete(value: T): boolean;
    clear(): void;
    keys(): IterableIterator<T>;
    values(): IterableIterator<T>;
    entries(): IterableIterator<[T, T]>;
  }

  interface SetConstructor {
    new (): Set<any>;
    new <T>(): Set<T>;
    prototype: Set<any>;
  }

  interface WeakMap<K, V> {
    clear(): void;
    delete(key: K): boolean;
    get(key: K): V;
    has(key: K): boolean;
    set(key: K, value?: V): WeakMap<K, V>;
  }

  interface WeakMapConstructor {
    new (): WeakMap<any, any>;
    new <K, V>(): WeakMap<K, V>;
    prototype: WeakMap<any, any>;
  }

  type MemberDecorator = <T>(
    target: Object,
    propertyKey: string | symbol,
    descriptor?: TypedPropertyDescriptor<T>,
  ) => TypedPropertyDescriptor<T> | void;
  declare const Symbol: { iterator: symbol; toPrimitive: symbol };
  declare const Set: SetConstructor;
  declare const WeakMap: WeakMapConstructor;
  declare const Map: MapConstructor;
  declare const global: any;

  // @ts-ignore
  declare const crypto: Crypto;

  // @ts-ignore
  declare const msCrypto: Crypto;
  declare const process: any;

  /**
   * Applies a set of decorators to a target object.
   * @param decorators An array of decorators.
   * @param target The target object.
   * @returns The result of applying the provided decorators.
   * @remarks Decorators are applied in reverse order of their positions in the array.
   * @example
   *
   *     class Example { }
   *
   *     // constructor
   *     Example = Reflect.decorate(decoratorsArray, Example);
   *
   */
  export declare function decorate(
    decorators: ClassDecorator[],
    target: Function,
  ): Function;

  /**
   * Applies a set of decorators to a property of a target object.
   * @param decorators An array of decorators.
   * @param target The target object.
   * @param propertyKey The property key to decorate.
   * @param attributes A property descriptor.
   * @remarks Decorators are applied in reverse order.
   * @example
   *
   *     class Example {
   *         // property declarations are not part of ES6, though they are valid in TypeScript:
   *         // static staticProperty;
   *         // property;
   *
   *         static staticMethod() { }
   *         method() { }
   *     }
   *
   *     // property (on constructor)
   *     Reflect.decorate(decoratorsArray, Example, "staticProperty");
   *
   *     // property (on prototype)
   *     Reflect.decorate(decoratorsArray, Example.prototype, "property");
   *
   *     // method (on constructor)
   *     Object.defineProperty(Example, "staticMethod",
   *         Reflect.decorate(decoratorsArray, Example, "staticMethod",
   *             Object.getOwnPropertyDescriptor(Example, "staticMethod")));
   *
   *     // method (on prototype)
   *     Object.defineProperty(Example.prototype, "method",
   *         Reflect.decorate(decoratorsArray, Example.prototype, "method",
   *             Object.getOwnPropertyDescriptor(Example.prototype, "method")));
   *
   */
  export declare function decorate(
    decorators: (PropertyDecorator | MethodDecorator)[],
    target: any,
    propertyKey: string | symbol,
    attributes?: PropertyDescriptor | null,
  ): PropertyDescriptor | undefined;

  /**
   * Applies a set of decorators to a property of a target object.
   * @param decorators An array of decorators.
   * @param target The target object.
   * @param propertyKey The property key to decorate.
   * @param attributes A property descriptor.
   * @remarks Decorators are applied in reverse order.
   * @example
   *
   *     class Example {
   *         // property declarations are not part of ES6, though they are valid in TypeScript:
   *         // static staticProperty;
   *         // property;
   *
   *         static staticMethod() { }
   *         method() { }
   *     }
   *
   *     // property (on constructor)
   *     Reflect.decorate(decoratorsArray, Example, "staticProperty");
   *
   *     // property (on prototype)
   *     Reflect.decorate(decoratorsArray, Example.prototype, "property");
   *
   *     // method (on constructor)
   *     Object.defineProperty(Example, "staticMethod",
   *         Reflect.decorate(decoratorsArray, Example, "staticMethod",
   *             Object.getOwnPropertyDescriptor(Example, "staticMethod")));
   *
   *     // method (on prototype)
   *     Object.defineProperty(Example.prototype, "method",
   *         Reflect.decorate(decoratorsArray, Example.prototype, "method",
   *             Object.getOwnPropertyDescriptor(Example.prototype, "method")));
   *
   */
  export declare function decorate(
    decorators: (PropertyDecorator | MethodDecorator)[],
    target: any,
    propertyKey: string | symbol,
    attributes: PropertyDescriptor,
  ): PropertyDescriptor;

  /**
   * A default metadata decorator factory that can be used on a class, class member, or parameter.
   * @param metadataKey The key for the metadata entry.
   * @param metadataValue The value for the metadata entry.
   * @returns A decorator function.
   * @remarks
   * If `metadataKey` is already defined for the target and target key, the
   * metadataValue for that key will be overwritten.
   * @example
   *
   *     // constructor
   *     @Reflect.metadata(key, value)
   *     class Example {
   *     }
   *
   *     // property (on constructor, TypeScript only)
   *     class Example {
   *         @Reflect.metadata(key, value)
   *         static staticProperty;
   *     }
   *
   *     // property (on prototype, TypeScript only)
   *     class Example {
   *         @Reflect.metadata(key, value)
   *         property;
   *     }
   *
   *     // method (on constructor)
   *     class Example {
   *         @Reflect.metadata(key, value)
   *         static staticMethod() { }
   *     }
   *
   *     // method (on prototype)
   *     class Example {
   *         @Reflect.metadata(key, value)
   *         method() { }
   *     }
   *
   */
  export declare function metadata(
    metadataKey: any,
    metadataValue: any,
  ): {
    (target: Function): void;
    (target: any, propertyKey: string | symbol): void;
  };

  /**
   * Define a unique metadata entry on the target.
   * @param metadataKey A key used to store and retrieve metadata.
   * @param metadataValue A value that contains attached metadata.
   * @param target The target object on which to define metadata.
   * @example
   *
   *     class Example {
   *     }
   *
   *     // constructor
   *     Reflect.defineMetadata("custom:annotation", options, Example);
   *
   *     // decorator factory as metadata-producing annotation.
   *     function MyAnnotation(options): ClassDecorator {
   *         return target => Reflect.defineMetadata("custom:annotation", options, target);
   *     }
   *
   */
  export declare function defineMetadata(
    metadataKey: any,
    metadataValue: any,
    target: any,
  ): void;

  /**
   * Define a unique metadata entry on the target.
   * @param metadataKey A key used to store and retrieve metadata.
   * @param metadataValue A value that contains attached metadata.
   * @param target The target object on which to define metadata.
   * @param propertyKey The property key for the target.
   * @example
   *
   *     class Example {
   *         // property declarations are not part of ES6, though they are valid in TypeScript:
   *         // static staticProperty;
   *         // property;
   *
   *         static staticMethod(p) { }
   *         method(p) { }
   *     }
   *
   *     // property (on constructor)
   *     Reflect.defineMetadata("custom:annotation", Number, Example, "staticProperty");
   *
   *     // property (on prototype)
   *     Reflect.defineMetadata("custom:annotation", Number, Example.prototype, "property");
   *
   *     // method (on constructor)
   *     Reflect.defineMetadata("custom:annotation", Number, Example, "staticMethod");
   *
   *     // method (on prototype)
   *     Reflect.defineMetadata("custom:annotation", Number, Example.prototype, "method");
   *
   *     // decorator factory as metadata-producing annotation.
   *     function MyAnnotation(options): PropertyDecorator {
   *         return (target, key) => Reflect.defineMetadata("custom:annotation", options, target, key);
   *     }
   *
   */
  export declare function defineMetadata(
    metadataKey: any,
    metadataValue: any,
    target: any,
    propertyKey: string | symbol,
  ): void;

  /**
   * Gets a value indicating whether the target object or its prototype chain has the provided metadata key defined.
   * @param metadataKey A key used to store and retrieve metadata.
   * @param target The target object on which the metadata is defined.
   * @returns `true` if the metadata key was defined on the target object or its prototype chain; otherwise, `false`.
   * @example
   *
   *     class Example {
   *     }
   *
   *     // constructor
   *     result = Reflect.hasMetadata("custom:annotation", Example);
   *
   */
  export declare function hasMetadata(metadataKey: any, target: any): boolean;

  /**
   * Gets a value indicating whether the target object or its prototype chain has the provided metadata key defined.
   * @param metadataKey A key used to store and retrieve metadata.
   * @param target The target object on which the metadata is defined.
   * @param propertyKey The property key for the target.
   * @returns `true` if the metadata key was defined on the target object or its prototype chain; otherwise, `false`.
   * @example
   *
   *     class Example {
   *         // property declarations are not part of ES6, though they are valid in TypeScript:
   *         // static staticProperty;
   *         // property;
   *
   *         static staticMethod(p) { }
   *         method(p) { }
   *     }
   *
   *     // property (on constructor)
   *     result = Reflect.hasMetadata("custom:annotation", Example, "staticProperty");
   *
   *     // property (on prototype)
   *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "property");
   *
   *     // method (on constructor)
   *     result = Reflect.hasMetadata("custom:annotation", Example, "staticMethod");
   *
   *     // method (on prototype)
   *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "method");
   *
   */
  export declare function hasMetadata(
    metadataKey: any,
    target: any,
    propertyKey: string | symbol,
  ): boolean;

  /**
   * Gets a value indicating whether the target object has the provided metadata key defined.
   * @param metadataKey A key used to store and retrieve metadata.
   * @param target The target object on which the metadata is defined.
   * @returns `true` if the metadata key was defined on the target object; otherwise, `false`.
   * @example
   *
   *     class Example {
   *     }
   *
   *     // constructor
   *     result = Reflect.hasOwnMetadata("custom:annotation", Example);
   *
   */
  export declare function hasOwnMetadata(
    metadataKey: any,
    target: any,
  ): boolean;

  /**
   * Gets a value indicating whether the target object has the provided metadata key defined.
   * @param metadataKey A key used to store and retrieve metadata.
   * @param target The target object on which the metadata is defined.
   * @param propertyKey The property key for the target.
   * @returns `true` if the metadata key was defined on the target object; otherwise, `false`.
   * @example
   *
   *     class Example {
   *         // property declarations are not part of ES6, though they are valid in TypeScript:
   *         // static staticProperty;
   *         // property;
   *
   *         static staticMethod(p) { }
   *         method(p) { }
   *     }
   *
   *     // property (on constructor)
   *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticProperty");
   *
   *     // property (on prototype)
   *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "property");
   *
   *     // method (on constructor)
   *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticMethod");
   *
   *     // method (on prototype)
   *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "method");
   *
   */
  export declare function hasOwnMetadata(
    metadataKey: any,
    target: any,
    propertyKey: string | symbol,
  ): boolean;

  /**
   * Gets the metadata value for the provided metadata key on the target object or its prototype chain.
   * @param metadataKey A key used to store and retrieve metadata.
   * @param target The target object on which the metadata is defined.
   * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
   * @example
   *
   *     class Example {
   *     }
   *
   *     // constructor
   *     result = Reflect.getMetadata("custom:annotation", Example);
   *
   */
  export declare function getMetadata(metadataKey: any, target: any): any;

  /**
   * Gets the metadata value for the provided metadata key on the target object or its prototype chain.
   * @param metadataKey A key used to store and retrieve metadata.
   * @param target The target object on which the metadata is defined.
   * @param propertyKey The property key for the target.
   * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
   * @example
   *
   *     class Example {
   *         // property declarations are not part of ES6, though they are valid in TypeScript:
   *         // static staticProperty;
   *         // property;
   *
   *         static staticMethod(p) { }
   *         method(p) { }
   *     }
   *
   *     // property (on constructor)
   *     result = Reflect.getMetadata("custom:annotation", Example, "staticProperty");
   *
   *     // property (on prototype)
   *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "property");
   *
   *     // method (on constructor)
   *     result = Reflect.getMetadata("custom:annotation", Example, "staticMethod");
   *
   *     // method (on prototype)
   *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "method");
   *
   */
  export declare function getMetadata(
    metadataKey: any,
    target: any,
    propertyKey: string | symbol,
  ): any;

  /**
   * Gets the metadata value for the provided metadata key on the target object.
   * @param metadataKey A key used to store and retrieve metadata.
   * @param target The target object on which the metadata is defined.
   * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
   * @example
   *
   *     class Example {
   *     }
   *
   *     // constructor
   *     result = Reflect.getOwnMetadata("custom:annotation", Example);
   *
   */
  export declare function getOwnMetadata(metadataKey: any, target: any): any;

  /**
   * Gets the metadata value for the provided metadata key on the target object.
   * @param metadataKey A key used to store and retrieve metadata.
   * @param target The target object on which the metadata is defined.
   * @param propertyKey The property key for the target.
   * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
   * @example
   *
   *     class Example {
   *         // property declarations are not part of ES6, though they are valid in TypeScript:
   *         // static staticProperty;
   *         // property;
   *
   *         static staticMethod(p) { }
   *         method(p) { }
   *     }
   *
   *     // property (on constructor)
   *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticProperty");
   *
   *     // property (on prototype)
   *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "property");
   *
   *     // method (on constructor)
   *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticMethod");
   *
   *     // method (on prototype)
   *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "method");
   *
   */
  export declare function getOwnMetadata(
    metadataKey: any,
    target: any,
    propertyKey: string | symbol,
  ): any;

  /**
   * Gets the metadata keys defined on the target object or its prototype chain.
   * @param target The target object on which the metadata is defined.
   * @returns An array of unique metadata keys.
   * @example
   *
   *     class Example {
   *     }
   *
   *     // constructor
   *     result = Reflect.getMetadataKeys(Example);
   *
   */
  export declare function getMetadataKeys(target: any): any[];

  /**
   * Gets the metadata keys defined on the target object or its prototype chain.
   * @param target The target object on which the metadata is defined.
   * @param propertyKey The property key for the target.
   * @returns An array of unique metadata keys.
   * @example
   *
   *     class Example {
   *         // property declarations are not part of ES6, though they are valid in TypeScript:
   *         // static staticProperty;
   *         // property;
   *
   *         static staticMethod(p) { }
   *         method(p) { }
   *     }
   *
   *     // property (on constructor)
   *     result = Reflect.getMetadataKeys(Example, "staticProperty");
   *
   *     // property (on prototype)
   *     result = Reflect.getMetadataKeys(Example.prototype, "property");
   *
   *     // method (on constructor)
   *     result = Reflect.getMetadataKeys(Example, "staticMethod");
   *
   *     // method (on prototype)
   *     result = Reflect.getMetadataKeys(Example.prototype, "method");
   *
   */
  export declare function getMetadataKeys(
    target: any,
    propertyKey: string | symbol,
  ): any[];

  /**
   * Gets the unique metadata keys defined on the target object.
   * @param target The target object on which the metadata is defined.
   * @returns An array of unique metadata keys.
   * @example
   *
   *     class Example {
   *     }
   *
   *     // constructor
   *     result = Reflect.getOwnMetadataKeys(Example);
   *
   */
  export declare function getOwnMetadataKeys(target: any): any[];

  /**
   * Gets the unique metadata keys defined on the target object.
   * @param target The target object on which the metadata is defined.
   * @param propertyKey The property key for the target.
   * @returns An array of unique metadata keys.
   * @example
   *
   *     class Example {
   *         // property declarations are not part of ES6, though they are valid in TypeScript:
   *         // static staticProperty;
   *         // property;
   *
   *         static staticMethod(p) { }
   *         method(p) { }
   *     }
   *
   *     // property (on constructor)
   *     result = Reflect.getOwnMetadataKeys(Example, "staticProperty");
   *
   *     // property (on prototype)
   *     result = Reflect.getOwnMetadataKeys(Example.prototype, "property");
   *
   *     // method (on constructor)
   *     result = Reflect.getOwnMetadataKeys(Example, "staticMethod");
   *
   *     // method (on prototype)
   *     result = Reflect.getOwnMetadataKeys(Example.prototype, "method");
   *
   */
  export declare function getOwnMetadataKeys(
    target: any,
    propertyKey: string | symbol,
  ): any[];

  /**
   * Deletes the metadata entry from the target object with the provided key.
   * @param metadataKey A key used to store and retrieve metadata.
   * @param target The target object on which the metadata is defined.
   * @returns `true` if the metadata entry was found and deleted; otherwise, false.
   * @example
   *
   *     class Example {
   *     }
   *
   *     // constructor
   *     result = Reflect.deleteMetadata("custom:annotation", Example);
   *
   */
  export declare function deleteMetadata(
    metadataKey: any,
    target: any,
  ): boolean;

  /**
   * Deletes the metadata entry from the target object with the provided key.
   * @param metadataKey A key used to store and retrieve metadata.
   * @param target The target object on which the metadata is defined.
   * @param propertyKey The property key for the target.
   * @returns `true` if the metadata entry was found and deleted; otherwise, false.
   * @example
   *
   *     class Example {
   *         // property declarations are not part of ES6, though they are valid in TypeScript:
   *         // static staticProperty;
   *         // property;
   *
   *         static staticMethod(p) { }
   *         method(p) { }
   *     }
   *
   *     // property (on constructor)
   *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticProperty");
   *
   *     // property (on prototype)
   *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "property");
   *
   *     // method (on constructor)
   *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticMethod");
   *
   *     // method (on prototype)
   *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "method");
   *
   */
  export declare function deleteMetadata(
    metadataKey: any,
    target: any,
    propertyKey: string | symbol,
  ): boolean;

  (function (
    this: any,
    factory: (
      exporter: <K extends keyof typeof Reflect>(
        key: K,
        value: typeof Reflect[K],
      ) => void,
    ) => void,
  ) {
    var self;
    const root = typeof global === "object"
      ? global
      : typeof self === "object"
      ? self
      : typeof this === "object"
      ? this
      : Function("return this;")();

    let exporter = makeExporter(Reflect);
    if (typeof root.Reflect === "undefined") {
      root.Reflect = Reflect;
    } else {
      exporter = makeExporter(root.Reflect, exporter);
    }

    factory(exporter);

    function makeExporter(
      target: typeof Reflect,
      previous?: <K extends keyof typeof Reflect>(
        key: K,
        value: typeof Reflect[K],
      ) => void,
    ) {
      return <K extends keyof typeof Reflect>(
        key: K,
        value: typeof Reflect[K],
      ) => {
        if (typeof target[key] !== "function") {
          Object.defineProperty(target, key, {
            configurable: true,
            writable: true,
            value,
          });
        }
        if (previous) previous(key, value);
      };
    }
  })(function (exporter) {
    const hasOwn = Object.prototype.hasOwnProperty;

    // feature test for Symbol support
    const supportsSymbol = typeof Symbol === "function";
    const toPrimitiveSymbol =
      supportsSymbol && typeof Symbol.toPrimitive !== "undefined"
        ? Symbol.toPrimitive
        : "@@toPrimitive";
    const iteratorSymbol =
      supportsSymbol && typeof Symbol.iterator !== "undefined"
        ? Symbol.iterator
        : "@@iterator";
    const supportsCreate = typeof Object.create === "function"; // feature test for Object.create support
    const supportsProto = { __proto__: [] } instanceof Array; // feature test for __proto__ support
    const downLevel = !supportsCreate && !supportsProto;

    const HashMap = {
      // create an object in dictionary mode (a.k.a. "slow" mode in v8)
      create: supportsCreate
        ? <V>() => MakeDictionary(Object.create(null) as HashMap<V>)
        : supportsProto
        ? <V>() => MakeDictionary({ __proto__: null as any } as HashMap<V>)
        : <V>() => MakeDictionary({} as HashMap<V>),

      has: downLevel
        ? <V>(map: HashMap<V>, key: string | number | symbol) =>
          hasOwn.call(map, key)
        : <V>(map: HashMap<V>, key: string | number | symbol) => key in map,

      get: downLevel
        ? <V>(map: HashMap<V>, key: string | number | symbol): V | undefined =>
          hasOwn.call(map, key) ? map[key as string | number] : undefined
        : <V>(map: HashMap<V>, key: string | number | symbol): V | undefined =>
          map[key as string | number],
    };

    // Load global or shim versions of Map, Set, and WeakMap
    const functionPrototype = Object.getPrototypeOf(Function);
    const usePolyfill = typeof process === "object" &&
      process.env &&
      process.env["REFLECT_METADATA_USE_MAP_POLYFILL"] === "true";
    const _Map: typeof Map = !usePolyfill &&
      typeof Map === "function" &&
      typeof Map.prototype.entries === "function"
      ? Map
      : CreateMapPolyfill();
    const _Set: typeof Set = !usePolyfill &&
      typeof Set === "function" &&
      typeof Set.prototype.entries === "function"
      ? Set
      : CreateSetPolyfill();
    const _WeakMap: typeof WeakMap =
      !usePolyfill && typeof WeakMap === "function"
        ? WeakMap
        : CreateWeakMapPolyfill();

    // [[Metadata]] internal slot
    // https://rbuckton.github.io/reflect-metadata/#ordinary-object-internal-methods-and-internal-slots
    const Metadata = new _WeakMap<
      any,
      Map<string | symbol | undefined, Map<any, any>>
    >();

    function decorate(decorators: ClassDecorator[], target: Function): Function;
    function decorate(
      decorators: (PropertyDecorator | MethodDecorator)[],
      target: any,
      propertyKey: string | symbol,
      attributes?: PropertyDescriptor | null,
    ): PropertyDescriptor | undefined;
    function decorate(
      decorators: (PropertyDecorator | MethodDecorator)[],
      target: any,
      propertyKey: string | symbol,
      attributes: PropertyDescriptor,
    ): PropertyDescriptor;

    /**
     * Applies a set of decorators to a property of a target object.
     * @param decorators An array of decorators.
     * @param target The target object.
     * @param propertyKey (Optional) The property key to decorate.
     * @param attributes (Optional) The property descriptor for the target key.
     * @remarks Decorators are applied in reverse order.
     * @example
     *
     *     class Example {
     *         // property declarations are not part of ES6, though they are valid in TypeScript:
     *         // static staticProperty;
     *         // property;
     *
     *         constructor(p) { }
     *         static staticMethod(p) { }
     *         method(p) { }
     *     }
     *
     *     // constructor
     *     Example = Reflect.decorate(decoratorsArray, Example);
     *
     *     // property (on constructor)
     *     Reflect.decorate(decoratorsArray, Example, "staticProperty");
     *
     *     // property (on prototype)
     *     Reflect.decorate(decoratorsArray, Example.prototype, "property");
     *
     *     // method (on constructor)
     *     Object.defineProperty(Example, "staticMethod",
     *         Reflect.decorate(decoratorsArray, Example, "staticMethod",
     *             Object.getOwnPropertyDescriptor(Example, "staticMethod")));
     *
     *     // method (on prototype)
     *     Object.defineProperty(Example.prototype, "method",
     *         Reflect.decorate(decoratorsArray, Example.prototype, "method",
     *             Object.getOwnPropertyDescriptor(Example.prototype, "method")));
     *
     */
    function decorate(
      decorators: (ClassDecorator | MemberDecorator)[],
      target: any,
      propertyKey?: string | symbol,
      attributes?: PropertyDescriptor | null,
    ): PropertyDescriptor | Function | undefined {
      if (!IsUndefined(propertyKey)) {
        if (!IsArray(decorators)) throw new TypeError();
        if (!IsObject(target)) throw new TypeError();
        if (
          !IsObject(attributes) &&
          !IsUndefined(attributes) &&
          !IsNull(attributes)
        ) {
          throw new TypeError();
        }
        if (IsNull(attributes)) attributes = undefined;
        propertyKey = ToPropertyKey(propertyKey);
        return DecorateProperty(
          <MemberDecorator[]> decorators,
          target,
          propertyKey,
          attributes,
        );
      } else {
        if (!IsArray(decorators)) throw new TypeError();
        if (!IsConstructor(target)) throw new TypeError();
        return DecorateConstructor(
          <ClassDecorator[]> decorators,
          <Function> target,
        );
      }
    }

    exporter("decorate", decorate);

    // 4.1.2 Reflect.metadata(metadataKey, metadataValue)
    // https://rbuckton.github.io/reflect-metadata/#reflect.metadata

    /**
     * A default metadata decorator factory that can be used on a class, class member, or parameter.
     * @param metadataKey The key for the metadata entry.
     * @param metadataValue The value for the metadata entry.
     * @returns A decorator function.
     * @remarks
     * If `metadataKey` is already defined for the target and target key, the
     * metadataValue for that key will be overwritten.
     * @example
     *
     *     // constructor
     *     @Reflect.metadata(key, value)
     *     class Example {
     *     }
     *
     *     // property (on constructor, TypeScript only)
     *     class Example {
     *         @Reflect.metadata(key, value)
     *         static staticProperty;
     *     }
     *
     *     // property (on prototype, TypeScript only)
     *     class Example {
     *         @Reflect.metadata(key, value)
     *         property;
     *     }
     *
     *     // method (on constructor)
     *     class Example {
     *         @Reflect.metadata(key, value)
     *         static staticMethod() { }
     *     }
     *
     *     // method (on prototype)
     *     class Example {
     *         @Reflect.metadata(key, value)
     *         method() { }
     *     }
     *
     */
    function metadata(metadataKey: any, metadataValue: any) {
      function decorator(target: Function): void;
      function decorator(target: any, propertyKey: string | symbol): void;
      function decorator(target: any, propertyKey?: string | symbol): void {
        if (!IsObject(target)) throw new TypeError();
        if (!IsUndefined(propertyKey) && !IsPropertyKey(propertyKey)) {
          throw new TypeError();
        }
        OrdinaryDefineOwnMetadata(
          metadataKey,
          metadataValue,
          target,
          propertyKey,
        );
      }
      return decorator;
    }

    exporter("metadata", metadata);

    // 4.1.3 Reflect.defineMetadata(metadataKey, metadataValue, target [, propertyKey])
    // https://rbuckton.github.io/reflect-metadata/#reflect.definemetadata

    function defineMetadata(
      metadataKey: any,
      metadataValue: any,
      target: any,
    ): void;
    function defineMetadata(
      metadataKey: any,
      metadataValue: any,
      target: any,
      propertyKey: string | symbol,
    ): void;

    /**
     * Define a unique metadata entry on the target.
     * @param metadataKey A key used to store and retrieve metadata.
     * @param metadataValue A value that contains attached metadata.
     * @param target The target object on which to define metadata.
     * @param propertyKey (Optional) The property key for the target.
     * @example
     *
     *     class Example {
     *         // property declarations are not part of ES6, though they are valid in TypeScript:
     *         // static staticProperty;
     *         // property;
     *
     *         constructor(p) { }
     *         static staticMethod(p) { }
     *         method(p) { }
     *     }
     *
     *     // constructor
     *     Reflect.defineMetadata("custom:annotation", options, Example);
     *
     *     // property (on constructor)
     *     Reflect.defineMetadata("custom:annotation", options, Example, "staticProperty");
     *
     *     // property (on prototype)
     *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "property");
     *
     *     // method (on constructor)
     *     Reflect.defineMetadata("custom:annotation", options, Example, "staticMethod");
     *
     *     // method (on prototype)
     *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "method");
     *
     *     // decorator factory as metadata-producing annotation.
     *     function MyAnnotation(options): Decorator {
     *         return (target, key?) => Reflect.defineMetadata("custom:annotation", options, target, key);
     *     }
     *
     */
    function defineMetadata(
      metadataKey: any,
      metadataValue: any,
      target: any,
      propertyKey?: string | symbol,
    ): void {
      if (!IsObject(target)) throw new TypeError();
      if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
      return OrdinaryDefineOwnMetadata(
        metadataKey,
        metadataValue,
        target,
        propertyKey,
      );
    }

    exporter("defineMetadata", defineMetadata);

    // 4.1.4 Reflect.hasMetadata(metadataKey, target [, propertyKey])
    // https://rbuckton.github.io/reflect-metadata/#reflect.hasmetadata

    function hasMetadata(metadataKey: any, target: any): boolean;
    function hasMetadata(
      metadataKey: any,
      target: any,
      propertyKey: string | symbol,
    ): boolean;

    /**
     * Gets a value indicating whether the target object or its prototype chain has the provided metadata key defined.
     * @param metadataKey A key used to store and retrieve metadata.
     * @param target The target object on which the metadata is defined.
     * @param propertyKey (Optional) The property key for the target.
     * @returns `true` if the metadata key was defined on the target object or its prototype chain; otherwise, `false`.
     * @example
     *
     *     class Example {
     *         // property declarations are not part of ES6, though they are valid in TypeScript:
     *         // static staticProperty;
     *         // property;
     *
     *         constructor(p) { }
     *         static staticMethod(p) { }
     *         method(p) { }
     *     }
     *
     *     // constructor
     *     result = Reflect.hasMetadata("custom:annotation", Example);
     *
     *     // property (on constructor)
     *     result = Reflect.hasMetadata("custom:annotation", Example, "staticProperty");
     *
     *     // property (on prototype)
     *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "property");
     *
     *     // method (on constructor)
     *     result = Reflect.hasMetadata("custom:annotation", Example, "staticMethod");
     *
     *     // method (on prototype)
     *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "method");
     *
     */
    function hasMetadata(
      metadataKey: any,
      target: any,
      propertyKey?: string | symbol,
    ): boolean {
      if (!IsObject(target)) throw new TypeError();
      if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
      return OrdinaryHasMetadata(metadataKey, target, propertyKey);
    }

    exporter("hasMetadata", hasMetadata);

    // 4.1.5 Reflect.hasOwnMetadata(metadataKey, target [, propertyKey])
    // https://rbuckton.github.io/reflect-metadata/#reflect-hasownmetadata

    function hasOwnMetadata(metadataKey: any, target: any): boolean;
    function hasOwnMetadata(
      metadataKey: any,
      target: any,
      propertyKey: string | symbol,
    ): boolean;

    /**
     * Gets a value indicating whether the target object has the provided metadata key defined.
     * @param metadataKey A key used to store and retrieve metadata.
     * @param target The target object on which the metadata is defined.
     * @param propertyKey (Optional) The property key for the target.
     * @returns `true` if the metadata key was defined on the target object; otherwise, `false`.
     * @example
     *
     *     class Example {
     *         // property declarations are not part of ES6, though they are valid in TypeScript:
     *         // static staticProperty;
     *         // property;
     *
     *         constructor(p) { }
     *         static staticMethod(p) { }
     *         method(p) { }
     *     }
     *
     *     // constructor
     *     result = Reflect.hasOwnMetadata("custom:annotation", Example);
     *
     *     // property (on constructor)
     *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticProperty");
     *
     *     // property (on prototype)
     *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "property");
     *
     *     // method (on constructor)
     *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticMethod");
     *
     *     // method (on prototype)
     *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "method");
     *
     */
    function hasOwnMetadata(
      metadataKey: any,
      target: any,
      propertyKey?: string | symbol,
    ): boolean {
      if (!IsObject(target)) throw new TypeError();
      if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
      return OrdinaryHasOwnMetadata(metadataKey, target, propertyKey);
    }

    exporter("hasOwnMetadata", hasOwnMetadata);

    // 4.1.6 Reflect.getMetadata(metadataKey, target [, propertyKey])
    // https://rbuckton.github.io/reflect-metadata/#reflect-getmetadata

    function getMetadata(metadataKey: any, target: any): any;
    function getMetadata(
      metadataKey: any,
      target: any,
      propertyKey: string | symbol,
    ): any;

    /**
     * Gets the metadata value for the provided metadata key on the target object or its prototype chain.
     * @param metadataKey A key used to store and retrieve metadata.
     * @param target The target object on which the metadata is defined.
     * @param propertyKey (Optional) The property key for the target.
     * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
     * @example
     *
     *     class Example {
     *         // property declarations are not part of ES6, though they are valid in TypeScript:
     *         // static staticProperty;
     *         // property;
     *
     *         constructor(p) { }
     *         static staticMethod(p) { }
     *         method(p) { }
     *     }
     *
     *     // constructor
     *     result = Reflect.getMetadata("custom:annotation", Example);
     *
     *     // property (on constructor)
     *     result = Reflect.getMetadata("custom:annotation", Example, "staticProperty");
     *
     *     // property (on prototype)
     *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "property");
     *
     *     // method (on constructor)
     *     result = Reflect.getMetadata("custom:annotation", Example, "staticMethod");
     *
     *     // method (on prototype)
     *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "method");
     *
     */
    function getMetadata(
      metadataKey: any,
      target: any,
      propertyKey?: string | symbol,
    ): any {
      if (!IsObject(target)) throw new TypeError();
      if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
      return OrdinaryGetMetadata(metadataKey, target, propertyKey);
    }

    exporter("getMetadata", getMetadata);

    // 4.1.7 Reflect.getOwnMetadata(metadataKey, target [, propertyKey])
    // https://rbuckton.github.io/reflect-metadata/#reflect-getownmetadata

    function getOwnMetadata(metadataKey: any, target: any): any;
    function getOwnMetadata(
      metadataKey: any,
      target: any,
      propertyKey: string | symbol,
    ): any;

    /**
     * Gets the metadata value for the provided metadata key on the target object.
     * @param metadataKey A key used to store and retrieve metadata.
     * @param target The target object on which the metadata is defined.
     * @param propertyKey (Optional) The property key for the target.
     * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
     * @example
     *
     *     class Example {
     *         // property declarations are not part of ES6, though they are valid in TypeScript:
     *         // static staticProperty;
     *         // property;
     *
     *         constructor(p) { }
     *         static staticMethod(p) { }
     *         method(p) { }
     *     }
     *
     *     // constructor
     *     result = Reflect.getOwnMetadata("custom:annotation", Example);
     *
     *     // property (on constructor)
     *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticProperty");
     *
     *     // property (on prototype)
     *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "property");
     *
     *     // method (on constructor)
     *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticMethod");
     *
     *     // method (on prototype)
     *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "method");
     *
     */
    function getOwnMetadata(
      metadataKey: any,
      target: any,
      propertyKey?: string | symbol,
    ): any {
      if (!IsObject(target)) throw new TypeError();
      if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
      return OrdinaryGetOwnMetadata(metadataKey, target, propertyKey);
    }

    exporter("getOwnMetadata", getOwnMetadata);

    // 4.1.8 Reflect.getMetadataKeys(target [, propertyKey])
    // https://rbuckton.github.io/reflect-metadata/#reflect-getmetadatakeys

    function getMetadataKeys(target: any): any[];
    function getMetadataKeys(target: any, propertyKey: string | symbol): any[];

    /**
     * Gets the metadata keys defined on the target object or its prototype chain.
     * @param target The target object on which the metadata is defined.
     * @param propertyKey (Optional) The property key for the target.
     * @returns An array of unique metadata keys.
     * @example
     *
     *     class Example {
     *         // property declarations are not part of ES6, though they are valid in TypeScript:
     *         // static staticProperty;
     *         // property;
     *
     *         constructor(p) { }
     *         static staticMethod(p) { }
     *         method(p) { }
     *     }
     *
     *     // constructor
     *     result = Reflect.getMetadataKeys(Example);
     *
     *     // property (on constructor)
     *     result = Reflect.getMetadataKeys(Example, "staticProperty");
     *
     *     // property (on prototype)
     *     result = Reflect.getMetadataKeys(Example.prototype, "property");
     *
     *     // method (on constructor)
     *     result = Reflect.getMetadataKeys(Example, "staticMethod");
     *
     *     // method (on prototype)
     *     result = Reflect.getMetadataKeys(Example.prototype, "method");
     *
     */
    function getMetadataKeys(
      target: any,
      propertyKey?: string | symbol,
    ): any[] {
      if (!IsObject(target)) throw new TypeError();
      if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
      return OrdinaryMetadataKeys(target, propertyKey);
    }

    exporter("getMetadataKeys", getMetadataKeys);

    // 4.1.9 Reflect.getOwnMetadataKeys(target [, propertyKey])
    // https://rbuckton.github.io/reflect-metadata/#reflect-getownmetadata

    function getOwnMetadataKeys(target: any): any[];
    function getOwnMetadataKeys(
      target: any,
      propertyKey: string | symbol,
    ): any[];

    /**
     * Gets the unique metadata keys defined on the target object.
     * @param target The target object on which the metadata is defined.
     * @param propertyKey (Optional) The property key for the target.
     * @returns An array of unique metadata keys.
     * @example
     *
     *     class Example {
     *         // property declarations are not part of ES6, though they are valid in TypeScript:
     *         // static staticProperty;
     *         // property;
     *
     *         constructor(p) { }
     *         static staticMethod(p) { }
     *         method(p) { }
     *     }
     *
     *     // constructor
     *     result = Reflect.getOwnMetadataKeys(Example);
     *
     *     // property (on constructor)
     *     result = Reflect.getOwnMetadataKeys(Example, "staticProperty");
     *
     *     // property (on prototype)
     *     result = Reflect.getOwnMetadataKeys(Example.prototype, "property");
     *
     *     // method (on constructor)
     *     result = Reflect.getOwnMetadataKeys(Example, "staticMethod");
     *
     *     // method (on prototype)
     *     result = Reflect.getOwnMetadataKeys(Example.prototype, "method");
     *
     */
    function getOwnMetadataKeys(
      target: any,
      propertyKey?: string | symbol,
    ): any[] {
      if (!IsObject(target)) throw new TypeError();
      if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
      return OrdinaryOwnMetadataKeys(target, propertyKey);
    }

    exporter("getOwnMetadataKeys", getOwnMetadataKeys);

    // 4.1.10 Reflect.deleteMetadata(metadataKey, target [, propertyKey])
    // https://rbuckton.github.io/reflect-metadata/#reflect-deletemetadata

    function deleteMetadata(metadataKey: any, target: any): boolean;
    function deleteMetadata(
      metadataKey: any,
      target: any,
      propertyKey: string | symbol,
    ): boolean;

    /**
     * Deletes the metadata entry from the target object with the provided key.
     * @param metadataKey A key used to store and retrieve metadata.
     * @param target The target object on which the metadata is defined.
     * @param propertyKey (Optional) The property key for the target.
     * @returns `true` if the metadata entry was found and deleted; otherwise, false.
     * @example
     *
     *     class Example {
     *         // property declarations are not part of ES6, though they are valid in TypeScript:
     *         // static staticProperty;
     *         // property;
     *
     *         constructor(p) { }
     *         static staticMethod(p) { }
     *         method(p) { }
     *     }
     *
     *     // constructor
     *     result = Reflect.deleteMetadata("custom:annotation", Example);
     *
     *     // property (on constructor)
     *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticProperty");
     *
     *     // property (on prototype)
     *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "property");
     *
     *     // method (on constructor)
     *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticMethod");
     *
     *     // method (on prototype)
     *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "method");
     *
     */
    function deleteMetadata(
      metadataKey: any,
      target: any,
      propertyKey?: string | symbol,
    ): boolean {
      if (!IsObject(target)) throw new TypeError();
      if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
      const metadataMap = GetOrCreateMetadataMap(
        target,
        propertyKey,
        /*Create*/ false,
      );
      if (IsUndefined(metadataMap)) return false;
      if (!metadataMap.delete(metadataKey)) return false;
      if (metadataMap.size > 0) return true;
      const targetMetadata = Metadata.get(target);
      targetMetadata.delete(propertyKey);
      if (targetMetadata.size > 0) return true;
      Metadata.delete(target);
      return true;
    }

    exporter("deleteMetadata", deleteMetadata);

    function DecorateConstructor(
      decorators: ClassDecorator[],
      target: Function,
    ): Function {
      for (let i = decorators.length - 1; i >= 0; --i) {
        const decorator = decorators[i];
        const decorated = decorator(target);
        if (!IsUndefined(decorated) && !IsNull(decorated)) {
          if (!IsConstructor(decorated)) throw new TypeError();
          target = <Function> decorated;
        }
      }
      return target;
    }

    function DecorateProperty(
      decorators: MemberDecorator[],
      target: any,
      propertyKey: string | symbol,
      descriptor: PropertyDescriptor | undefined,
    ): PropertyDescriptor | undefined {
      for (let i = decorators.length - 1; i >= 0; --i) {
        const decorator = decorators[i];
        const decorated = decorator(target, propertyKey, descriptor);
        if (!IsUndefined(decorated) && !IsNull(decorated)) {
          if (!IsObject(decorated)) throw new TypeError();
          descriptor = <PropertyDescriptor> decorated;
        }
      }
      return descriptor;
    }

    // 2.1.1 GetOrCreateMetadataMap(O, P, Create)
    // https://rbuckton.github.io/reflect-metadata/#getorcreatemetadatamap
    function GetOrCreateMetadataMap(
      O: any,
      P: string | symbol | undefined,
      Create: true,
    ): Map<any, any>;
    function GetOrCreateMetadataMap(
      O: any,
      P: string | symbol | undefined,
      Create: false,
    ): Map<any, any> | undefined;
    function GetOrCreateMetadataMap(
      O: any,
      P: string | symbol | undefined,
      Create: boolean,
    ): Map<any, any> | undefined {
      let targetMetadata = Metadata.get(O);
      if (IsUndefined(targetMetadata)) {
        if (!Create) return undefined;
        targetMetadata = new _Map<string | symbol | undefined, Map<any, any>>();
        Metadata.set(O, targetMetadata);
      }
      let metadataMap = targetMetadata.get(P);
      if (IsUndefined(metadataMap)) {
        if (!Create) return undefined;
        metadataMap = new _Map<any, any>();
        targetMetadata.set(P, metadataMap);
      }
      return metadataMap;
    }

    // 3.1.1.1 OrdinaryHasMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinaryhasmetadata
    function OrdinaryHasMetadata(
      MetadataKey: any,
      O: any,
      P: string | symbol | undefined,
    ): boolean {
      const hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
      if (hasOwn) return true;
      const parent = OrdinaryGetPrototypeOf(O);
      if (!IsNull(parent)) return OrdinaryHasMetadata(MetadataKey, parent, P);
      return false;
    }

    // 3.1.2.1 OrdinaryHasOwnMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinaryhasownmetadata
    function OrdinaryHasOwnMetadata(
      MetadataKey: any,
      O: any,
      P: string | symbol | undefined,
    ): boolean {
      const metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
      if (IsUndefined(metadataMap)) return false;
      return ToBoolean(metadataMap.has(MetadataKey));
    }

    // 3.1.3.1 OrdinaryGetMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarygetmetadata
    function OrdinaryGetMetadata(
      MetadataKey: any,
      O: any,
      P: string | symbol | undefined,
    ): any {
      const hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
      if (hasOwn) return OrdinaryGetOwnMetadata(MetadataKey, O, P);
      const parent = OrdinaryGetPrototypeOf(O);
      if (!IsNull(parent)) return OrdinaryGetMetadata(MetadataKey, parent, P);
      return undefined;
    }

    // 3.1.4.1 OrdinaryGetOwnMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarygetownmetadata
    function OrdinaryGetOwnMetadata(
      MetadataKey: any,
      O: any,
      P: string | symbol | undefined,
    ): any {
      const metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
      if (IsUndefined(metadataMap)) return undefined;
      return metadataMap.get(MetadataKey);
    }

    // 3.1.5.1 OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarydefineownmetadata
    function OrdinaryDefineOwnMetadata(
      MetadataKey: any,
      MetadataValue: any,
      O: any,
      P: string | symbol | undefined,
    ): void {
      const metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ true);
      metadataMap.set(MetadataKey, MetadataValue);
    }

    // 3.1.6.1 OrdinaryMetadataKeys(O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarymetadatakeys
    function OrdinaryMetadataKeys(
      O: any,
      P: string | symbol | undefined,
    ): any[] {
      const ownKeys = OrdinaryOwnMetadataKeys(O, P);
      const parent = OrdinaryGetPrototypeOf(O);
      if (parent === null) return ownKeys;
      const parentKeys = OrdinaryMetadataKeys(parent, P);
      if (parentKeys.length <= 0) return ownKeys;
      if (ownKeys.length <= 0) return parentKeys;
      const set = new _Set<any>();
      const keys: any[] = [];
      for (const key of ownKeys) {
        const hasKey = set.has(key);
        if (!hasKey) {
          set.add(key);
          keys.push(key);
        }
      }
      for (const key of parentKeys) {
        const hasKey = set.has(key);
        if (!hasKey) {
          set.add(key);
          keys.push(key);
        }
      }
      return keys;
    }

    // 3.1.7.1 OrdinaryOwnMetadataKeys(O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinaryownmetadatakeys
    function OrdinaryOwnMetadataKeys(
      O: any,
      P: string | symbol | undefined,
    ): any[] {
      const keys: any[] = [];
      const metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
      if (IsUndefined(metadataMap)) return keys;
      const keysObj = metadataMap.keys();
      const iterator = GetIterator(keysObj);
      let k = 0;
      while (true) {
        const next = IteratorStep(iterator);
        if (!next) {
          keys.length = k;
          return keys;
        }
        const nextValue = IteratorValue(next);
        try {
          keys[k] = nextValue;
        } catch (e) {
          try {
            IteratorClose(iterator);
          } finally {
            throw e;
          }
        }
        k++;
      }
    }

    // 6 ECMAScript Data Typ0es and Values
    // https://tc39.github.io/ecma262/#sec-ecmascript-data-types-and-values
    function Type(x: any): Tag {
      if (x === null) return Tag.Null;
      switch (typeof x) {
        case "undefined":
          return Tag.Undefined;
        case "boolean":
          return Tag.Boolean;
        case "string":
          return Tag.String;
        case "symbol":
          return Tag.Symbol;
        case "number":
          return Tag.Number;
        case "object":
          return x === null ? Tag.Null : Tag.Object;
        default:
          return Tag.Object;
      }
    }

    // 6.1 ECMAScript Language Types
    // https://tc39.github.io/ecma262/#sec-ecmascript-language-types
    const enum Tag {
      Undefined,
      Null,
      Boolean,
      String,
      Symbol,
      Number,
      Object,
    }

    // 6.1.1 The Undefined Type
    // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-undefined-type
    function IsUndefined(x: any): x is undefined {
      return x === undefined;
    }

    // 6.1.2 The Null Type
    // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-null-type
    function IsNull(x: any): x is null {
      return x === null;
    }

    // 6.1.5 The Symbol Type
    // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-symbol-type
    function IsSymbol(x: any): x is symbol {
      return typeof x === "symbol";
    }

    // 6.1.7 The Object Type
    // https://tc39.github.io/ecma262/#sec-object-type
    function IsObject<
      T,
    >(x: T | undefined | null | boolean | string | symbol | number): x is T {
      return typeof x === "object" ? x !== null : typeof x === "function";
    }

    // 7.1 Type Conversion
    // https://tc39.github.io/ecma262/#sec-type-conversion

    // 7.1.1 ToPrimitive(input [, PreferredType])
    // https://tc39.github.io/ecma262/#sec-toprimitive
    function ToPrimitive(
      input: any,
      PreferredType?: Tag,
    ): undefined | null | boolean | string | symbol | number {
      switch (Type(input)) {
        case Tag.Undefined:
          return input;
        case Tag.Null:
          return input;
        case Tag.Boolean:
          return input;
        case Tag.String:
          return input;
        case Tag.Symbol:
          return input;
        case Tag.Number:
          return input;
      }
      const hint: "string" | "number" | "default" = PreferredType === Tag.String
        ? "string"
        : PreferredType === Tag.Number
        ? "number"
        : "default";
      const exoticToPrim = GetMethod(input, toPrimitiveSymbol);
      if (exoticToPrim !== undefined) {
        const result = exoticToPrim.call(input, hint);
        if (IsObject(result)) throw new TypeError();
        return result;
      }
      return OrdinaryToPrimitive(input, hint === "default" ? "number" : hint);
    }

    // 7.1.1.1 OrdinaryToPrimitive(O, hint)
    // https://tc39.github.io/ecma262/#sec-ordinarytoprimitive
    function OrdinaryToPrimitive(
      O: any,
      hint: "string" | "number",
    ): undefined | null | boolean | string | symbol | number {
      if (hint === "string") {
        const toString = O.toString;
        if (IsCallable(toString)) {
          const result = toString.call(O);
          if (!IsObject(result)) return result;
        }
        const valueOf = O.valueOf;
        if (IsCallable(valueOf)) {
          const result = valueOf.call(O);
          if (!IsObject(result)) return result;
        }
      } else {
        const valueOf = O.valueOf;
        if (IsCallable(valueOf)) {
          const result = valueOf.call(O);
          if (!IsObject(result)) return result;
        }
        const toString = O.toString;
        if (IsCallable(toString)) {
          const result = toString.call(O);
          if (!IsObject(result)) return result;
        }
      }
      throw new TypeError();
    }

    // 7.1.2 ToBoolean(argument)
    // https://tc39.github.io/ecma262/2016/#sec-toboolean
    function ToBoolean(argument: any): boolean {
      return !!argument;
    }

    // 7.1.12 ToString(argument)
    // https://tc39.github.io/ecma262/#sec-tostring
    function ToString(argument: any): string {
      return "" + argument;
    }

    // 7.1.14 ToPropertyKey(argument)
    // https://tc39.github.io/ecma262/#sec-topropertykey
    function ToPropertyKey(argument: any): string | symbol {
      const key = ToPrimitive(argument, Tag.String);
      if (IsSymbol(key)) return key;
      return ToString(key);
    }

    // 7.2 Testing and Comparison Operations
    // https://tc39.github.io/ecma262/#sec-testing-and-comparison-operations

    // 7.2.2 IsArray(argument)
    // https://tc39.github.io/ecma262/#sec-isarray
    function IsArray(argument: any): argument is any[] {
      return Array.isArray
        ? Array.isArray(argument)
        : argument instanceof Object
        ? argument instanceof Array
        : Object.prototype.toString.call(argument) === "[object Array]";
    }

    // 7.2.3 IsCallable(argument)
    // https://tc39.github.io/ecma262/#sec-iscallable
    function IsCallable(argument: any): argument is Function {
      // NOTE: This is an approximation as we cannot check for [[Call]] internal method.
      return typeof argument === "function";
    }

    // 7.2.4 IsConstructor(argument)
    // https://tc39.github.io/ecma262/#sec-isconstructor
    function IsConstructor(argument: any): argument is Function {
      // NOTE: This is an approximation as we cannot check for [[Construct]] internal method.
      return typeof argument === "function";
    }

    // 7.2.7 IsPropertyKey(argument)
    // https://tc39.github.io/ecma262/#sec-ispropertykey
    function IsPropertyKey(argument: any): argument is string | symbol {
      switch (Type(argument)) {
        case Tag.String:
          return true;
        case Tag.Symbol:
          return true;
        default:
          return false;
      }
    }

    // 7.3 Operations on Objects
    // https://tc39.github.io/ecma262/#sec-operations-on-objects

    // 7.3.9 GetMethod(V, P)
    // https://tc39.github.io/ecma262/#sec-getmethod
    function GetMethod(V: any, P: any): Function | undefined {
      const func = V[P];
      if (func === undefined || func === null) return undefined;
      if (!IsCallable(func)) throw new TypeError();
      return func;
    }

    // 7.4 Operations on Iterator Objects
    // https://tc39.github.io/ecma262/#sec-operations-on-iterator-objects

    function GetIterator<T>(obj: Iterable<T>): Iterator<T> {
      const method = GetMethod(obj, iteratorSymbol);
      if (!IsCallable(method)) throw new TypeError(); // from Call
      const iterator = method.call(obj);
      if (!IsObject(iterator)) throw new TypeError();
      return iterator;
    }

    // 7.4.4 IteratorValue(iterResult)
    // https://tc39.github.io/ecma262/2016/#sec-iteratorvalue
    function IteratorValue<T>(iterResult: IteratorResult<T>): T {
      return iterResult.value;
    }

    // 7.4.5 IteratorStep(iterator)
    // https://tc39.github.io/ecma262/#sec-iteratorstep
    function IteratorStep<T>(iterator: Iterator<T>): IteratorResult<T> | false {
      const result = iterator.next();
      return result.done ? false : result;
    }

    // 7.4.6 IteratorClose(iterator, completion)
    // https://tc39.github.io/ecma262/#sec-iteratorclose
    function IteratorClose<T>(iterator: Iterator<T>) {
      const f = iterator["return"];
      if (f) f.call(iterator);
    }

    // 9.1 Ordinary Object Internal Methods and Internal Slots
    // https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots

    // 9.1.1.1 OrdinaryGetPrototypeOf(O)
    // https://tc39.github.io/ecma262/#sec-ordinarygetprototypeof
    function OrdinaryGetPrototypeOf(O: any): any {
      const proto = Object.getPrototypeOf(O);
      if (typeof O !== "function" || O === functionPrototype) return proto;

      // TypeScript doesn't set __proto__ in ES5, as it's non-standard.
      // Try to determine the superclass constructor. Compatible implementations
      // must either set __proto__ on a subclass constructor to the superclass constructor,
      // or ensure each class has a valid `constructor` property on its prototype that
      // points back to the constructor.

      // If this is not the same as Function.[[Prototype]], then this is definately inherited.
      // This is the case when in ES6 or when using __proto__ in a compatible browser.
      if (proto !== functionPrototype) return proto;

      // If the super prototype is Object.prototype, null, or undefined, then we cannot determine the heritage.
      const prototype = O.prototype;
      const prototypeProto = prototype && Object.getPrototypeOf(prototype);
      if (prototypeProto == null || prototypeProto === Object.prototype) {
        return proto;
      }

      // If the constructor was not a function, then we cannot determine the heritage.
      const constructor = prototypeProto.constructor;
      if (typeof constructor !== "function") return proto;

      // If we have some kind of self-reference, then we cannot determine the heritage.
      if (constructor === O) return proto;

      // we have a pretty good guess at the heritage.
      return constructor;
    }

    // naive Map shim
    function CreateMapPolyfill(): MapConstructor {
      const cacheSentinel = {};
      const arraySentinel: any[] = [];

      class MapIterator<
        K,
        V,
        R extends K | V | [K, V],
      > implements IterableIterator<R> {
        private _keys: K[];
        private _values: V[];
        private _index = 0;
        private _selector: (key: K, value: V) => R;
        constructor(keys: K[], values: V[], selector: (key: K, value: V) => R) {
          this._keys = keys;
          this._values = values;
          this._selector = selector;
        }
        "@@iterator"() {
          return this;
        }
        [iteratorSymbol]() {
          return this;
        }
        next(): IteratorResult<R> {
          const index = this._index;
          if (index >= 0 && index < this._keys.length) {
            const result = this._selector(
              this._keys[index],
              this._values[index],
            );
            if (index + 1 >= this._keys.length) {
              this._index = -1;
              this._keys = arraySentinel;
              this._values = arraySentinel;
            } else {
              this._index++;
            }
            return { value: result, done: false };
          }
          return { value: <never> undefined, done: true };
        }
        throw(error: any): IteratorResult<R> {
          if (this._index >= 0) {
            this._index = -1;
            this._keys = arraySentinel;
            this._values = arraySentinel;
          }
          throw error;
        }
        return(value?: R): IteratorResult<R> {
          if (this._index >= 0) {
            this._index = -1;
            this._keys = arraySentinel;
            this._values = arraySentinel;
          }
          return { value: <never> value, done: true };
        }
      }

      return class Map<K, V> {
        private _keys: K[] = [];
        private _values: (V | undefined)[] = [];
        private _cacheKey = cacheSentinel;
        private _cacheIndex = -2;
        get size() {
          return this._keys.length;
        }
        has(key: K): boolean {
          return this._find(key, /*insert*/ false) >= 0;
        }
        get(key: K): V | undefined {
          const index = this._find(key, /*insert*/ false);
          return index >= 0 ? this._values[index] : undefined;
        }
        set(key: K, value: V): this {
          const index = this._find(key, /*insert*/ true);
          this._values[index] = value;
          return this;
        }
        delete(key: K): boolean {
          const index = this._find(key, /*insert*/ false);
          if (index >= 0) {
            const size = this._keys.length;
            for (let i = index + 1; i < size; i++) {
              this._keys[i - 1] = this._keys[i];
              this._values[i - 1] = this._values[i];
            }
            this._keys.length--;
            this._values.length--;
            if (key === this._cacheKey) {
              this._cacheKey = cacheSentinel;
              this._cacheIndex = -2;
            }
            return true;
          }
          return false;
        }
        clear(): void {
          this._keys.length = 0;
          this._values.length = 0;
          this._cacheKey = cacheSentinel;
          this._cacheIndex = -2;
        }
        keys() {
          return new MapIterator(this._keys, this._values, getKey);
        }
        values() {
          return new MapIterator(this._keys, this._values, getValue);
        }
        entries() {
          return new MapIterator(this._keys, this._values, getEntry);
        }
        "@@iterator"() {
          return this.entries();
        }
        [iteratorSymbol]() {
          return this.entries();
        }
        private _find(key: K, insert?: boolean): number {
          if (this._cacheKey !== key) {
            this._cacheIndex = this._keys.indexOf((this._cacheKey = key));
          }
          if (this._cacheIndex < 0 && insert) {
            this._cacheIndex = this._keys.length;
            this._keys.push(key);
            this._values.push(undefined);
          }
          return this._cacheIndex;
        }
      };

      function getKey<K, V>(key: K, _: V) {
        return key;
      }

      function getValue<K, V>(_: K, value: V) {
        return value;
      }

      function getEntry<K, V>(key: K, value: V) {
        return [key, value] as [K, V];
      }
    }

    // naive Set shim
    function CreateSetPolyfill(): SetConstructor {
      return class Set<T> {
        private _map = new _Map<any, any>();
        get size() {
          return this._map.size;
        }
        has(value: T): boolean {
          return this._map.has(value);
        }
        add(value: T): Set<T> {
          return this._map.set(value, value), this;
        }
        delete(value: T): boolean {
          return this._map.delete(value);
        }
        clear(): void {
          this._map.clear();
        }
        keys() {
          return this._map.keys();
        }
        values() {
          return this._map.values();
        }
        entries() {
          return this._map.entries();
        }
        "@@iterator"() {
          return this.keys();
        }
        [iteratorSymbol]() {
          return this.keys();
        }
      };
    }

    // naive WeakMap shim
    function CreateWeakMapPolyfill(): WeakMapConstructor {
      const UUID_SIZE = 16;
      const keys = HashMap.create<boolean>();
      const rootKey = CreateUniqueKey();
      return class WeakMap<K, V> {
        private _key = CreateUniqueKey();
        has(target: K): boolean {
          const table = GetOrCreateWeakMapTable<K>(target, /*create*/ false);
          return table !== undefined ? HashMap.has(table, this._key) : false;
        }
        get(target: K): V {
          const table = GetOrCreateWeakMapTable<K>(target, /*create*/ false);
          return table !== undefined
            ? HashMap.get(table, this._key)
            : undefined;
        }
        set(target: K, value: V): WeakMap<K, V> {
          const table = GetOrCreateWeakMapTable<K>(target, /*create*/ true);
          table[this._key] = value;
          return this;
        }
        delete(target: K): boolean {
          const table = GetOrCreateWeakMapTable<K>(target, /*create*/ false);
          return table !== undefined ? delete table[this._key] : false;
        }
        clear(): void {
          // NOTE: not a real clear, just makes the previous data unreachable
          this._key = CreateUniqueKey();
        }
      };

      function CreateUniqueKey(): string {
        let key: string;
        do key = "@@WeakMap@@" + CreateUUID(); while (HashMap.has(keys, key));
        keys[key] = true;
        return key;
      }

      function GetOrCreateWeakMapTable<
        K,
      >(target: K, create: true): HashMap<any>;
      function GetOrCreateWeakMapTable<
        K,
      >(target: K, create: false): HashMap<any> | undefined;
      function GetOrCreateWeakMapTable<
        K,
      >(target: K, create: boolean): HashMap<any> | undefined {
        if (!hasOwn.call(target, rootKey)) {
          if (!create) return undefined;
          Object.defineProperty(target, rootKey, {
            value: HashMap.create<any>(),
          });
        }
        return (<any> target)[rootKey];
      }

      function FillRandomBytes(buffer: BufferLike, size: number): BufferLike {
        for (let i = 0; i < size; ++i) buffer[i] = (Math.random() * 0xff) | 0;
        return buffer;
      }

      function GenRandomBytes(size: number): BufferLike {
        if (typeof Uint8Array === "function") {
          if (typeof crypto !== "undefined") {
            return crypto.getRandomValues(new Uint8Array(size)) as Uint8Array;
          }
          if (typeof msCrypto !== "undefined") {
            return msCrypto.getRandomValues(new Uint8Array(size)) as Uint8Array;
          }
          return FillRandomBytes(new Uint8Array(size), size);
        }
        return FillRandomBytes(new Array(size), size);
      }

      function CreateUUID() {
        const data = GenRandomBytes(UUID_SIZE);
        // mark as random - RFC 4122 § 4.4
        data[6] = (data[6] & 0x4f) | 0x40;
        data[8] = (data[8] & 0xbf) | 0x80;
        let result = "";
        for (let offset = 0; offset < UUID_SIZE; ++offset) {
          const byte = data[offset];
          if (offset === 4 || offset === 6 || offset === 8) result += "-";
          if (byte < 16) result += "0";
          result += byte.toString(16).toLowerCase();
        }
        return result;
      }
    }

    // uses a heuristic used by v8 and chakra to force an object into dictionary mode.
    function MakeDictionary<T>(obj: T): T {
      (<any> obj).__ = undefined;
      delete (<any> obj).__;
      return obj;
    }
  });
}
