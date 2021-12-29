// Loaded from https://deno.land/std@0.114.0/node/events.ts


// Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.
// Copyright (c) 2019 Denolibs authors. All rights reserved. MIT license.
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

import { assert } from "../_util/assert.ts";
import { makeMethodsEnumerable, notImplemented } from "./_utils.ts";
import {
  ERR_INVALID_ARG_TYPE,
  ERR_OUT_OF_RANGE,
  ERR_UNHANDLED_ERROR,
} from "./_errors.ts";
import { inspect } from "./util.ts";

// deno-lint-ignore no-explicit-any
export type GenericFunction = (...args: any[]) => any;

export interface WrappedFunction extends Function {
  listener: GenericFunction;
}

function ensureArray<T>(maybeArray: T[] | T): T[] {
  return Array.isArray(maybeArray) ? maybeArray : [maybeArray];
}

// deno-lint-ignore no-explicit-any
function createIterResult(value: any, done: boolean): IteratorResult<any> {
  return { value, done };
}

interface AsyncIterable {
  // deno-lint-ignore no-explicit-any
  next(): Promise<IteratorResult<any, any>>;
  // deno-lint-ignore no-explicit-any
  return(): Promise<IteratorResult<any, any>>;
  throw(err: Error): void;
  // deno-lint-ignore no-explicit-any
  [Symbol.asyncIterator](): any;
}

type EventMap = Record<
  string | symbol,
  (
    | (Array<GenericFunction | WrappedFunction>)
    | GenericFunction
    | WrappedFunction
  ) & { warned?: boolean }
>;

export let defaultMaxListeners = 10;
function validateMaxListeners(n: number, name: string): void {
  if (!Number.isInteger(n) || Number.isNaN(n) || n < 0) {
    throw new ERR_OUT_OF_RANGE(name, "a non-negative number", inspect(n));
  }
}

function setMaxListeners(
  n: number,
  ...eventTargets: Array<EventEmitter | EventTarget>
): void {
  validateMaxListeners(n, "n");
  if (eventTargets.length === 0) {
    defaultMaxListeners = n;
  } else {
    for (const target of eventTargets) {
      if (target instanceof EventEmitter) {
        target.setMaxListeners(n);
      } else if (target instanceof EventTarget) {
        notImplemented(
          "setMaxListeners currently does not support EventTarget",
        );
      } else {
        throw new ERR_INVALID_ARG_TYPE(
          "eventTargets",
          ["EventEmitter", "EventTarget"],
          target,
        );
      }
    }
  }
}

/**
 * See also https://nodejs.org/api/events.html
 */
export class EventEmitter {
  public static captureRejectionSymbol = Symbol.for("nodejs.rejection");
  public static errorMonitor = Symbol("events.errorMonitor");
  public static get defaultMaxListeners() {
    return defaultMaxListeners;
  }
  public static set defaultMaxListeners(value: number) {
    validateMaxListeners(value, "defaultMaxListeners");
    defaultMaxListeners = value;
  }

  private maxListeners: number | undefined;
  private _events!: EventMap;

  static #init(emitter: EventEmitter): void {
    if (
      emitter._events == null ||
      emitter._events === Object.getPrototypeOf(emitter)._events // If `emitter` does not own `_events` but the prototype does
    ) {
      emitter._events = Object.create(null);
    }
  }

  /**
   * Overrides `call` to mimic the es5 behavior with the es6 class.
   */
  // deno-lint-ignore no-explicit-any
  static call = function call(thisArg: any): void {
    EventEmitter.#init(thisArg);
  };

  constructor() {
    EventEmitter.#init(this);
  }

  /** Alias for emitter.on(eventName, listener). */
  addListener(
    eventName: string | symbol,
    listener: GenericFunction | WrappedFunction,
  ): this {
    return EventEmitter.#addListener(this, eventName, listener, false);
  }

  /**
   * Synchronously calls each of the listeners registered for the event named
   * eventName, in the order they were registered, passing the supplied
   * arguments to each.
   * @return true if the event had listeners, false otherwise
   */
  // deno-lint-ignore no-explicit-any
  public emit(eventName: string | symbol, ...args: any[]): boolean {
    if (hasListeners(this._events, eventName)) {
      if (
        eventName === "error" &&
        hasListeners(this._events, EventEmitter.errorMonitor)
      ) {
        this.emit(EventEmitter.errorMonitor, ...args);
      }

      const listeners = ensureArray(this._events[eventName]!)
        .slice() as Array<GenericFunction>; // We copy with slice() so array is not mutated during emit
      for (const listener of listeners) {
        try {
          listener.apply(this, args);
        } catch (err) {
          this.emit("error", err);
        }
      }
      return true;
    } else if (eventName === "error") {
      if (hasListeners(this._events, EventEmitter.errorMonitor)) {
        this.emit(EventEmitter.errorMonitor, ...args);
      }
      let err = args.length > 0 ? args[0] : "Unhandled error.";
      if (err instanceof Error) {
        throw err;
      }

      try {
        err = inspect(err);
      } catch {
        // pass
      }
      throw new ERR_UNHANDLED_ERROR(err);
    }
    return false;
  }

  /**
   * Returns an array listing the events for which the emitter has
   * registered listeners.
   */
  public eventNames(): [string | symbol] {
    return Reflect.ownKeys(this._events) as [
      string | symbol,
    ];
  }

  /**
   * Returns the current max listener value for the EventEmitter which is
   * either set by emitter.setMaxListeners(n) or defaults to
   * EventEmitter.defaultMaxListeners.
   */
  public getMaxListeners(): number {
    return EventEmitter.#getMaxListeners(this);
  }

  /**
   * Returns the number of listeners listening to the event named
   * eventName.
   */
  public listenerCount(eventName: string | symbol): number {
    return EventEmitter.#listenerCount(this, eventName);
  }

  static listenerCount(
    emitter: EventEmitter,
    eventName: string | symbol,
  ): number {
    return emitter.listenerCount(eventName);
  }

  /** Returns a copy of the array of listeners for the event named eventName.*/
  public listeners(eventName: string | symbol): GenericFunction[] {
    return listeners(this._events, eventName, true);
  }

  /**
   * Returns a copy of the array of listeners for the event named eventName,
   * including any wrappers (such as those created by .once()).
   */
  public rawListeners(
    eventName: string | symbol,
  ): Array<GenericFunction | WrappedFunction> {
    return listeners(this._events, eventName, false);
  }

  /** Alias for emitter.removeListener(). */
  public off(
    // deno-lint-ignore no-unused-vars
    eventName: string | symbol,
    // deno-lint-ignore no-unused-vars
    listener: GenericFunction,
    // deno-lint-ignore ban-ts-comment
    // @ts-ignore
  ): this {
    // The body of this method is empty because it will be overwritten by later code. (`EventEmitter.prototype.off = EventEmitter.prototype.removeListener;`)
    // The purpose of this dirty hack is to get around the current limitation of TypeScript type checking.
  }

  /**
   * Adds the listener function to the end of the listeners array for the event
   *  named eventName. No checks are made to see if the listener has already
   * been added. Multiple calls passing the same combination of eventName and
   * listener will result in the listener being added, and called, multiple
   * times.
   */
  public on(
    // deno-lint-ignore no-unused-vars
    eventName: string | symbol,
    // deno-lint-ignore no-unused-vars
    listener: GenericFunction | WrappedFunction,
    // deno-lint-ignore ban-ts-comment
    // @ts-ignore
  ): this {
    // The body of this method is empty because it will be overwritten by later code. (`EventEmitter.prototype.addListener = EventEmitter.prototype.on;`)
    // The purpose of this dirty hack is to get around the current limitation of TypeScript type checking.
  }

  /**
   * Adds a one-time listener function for the event named eventName. The next
   * time eventName is triggered, this listener is removed and then invoked.
   */
  public once(eventName: string | symbol, listener: GenericFunction): this {
    const wrapped: WrappedFunction = onceWrap(this, eventName, listener);
    this.on(eventName, wrapped);
    return this;
  }

  /**
   * Adds the listener function to the beginning of the listeners array for the
   *  event named eventName. No checks are made to see if the listener has
   * already been added. Multiple calls passing the same combination of
   * eventName and listener will result in the listener being added, and
   * called, multiple times.
   */
  public prependListener(
    eventName: string | symbol,
    listener: GenericFunction | WrappedFunction,
  ): this {
    return EventEmitter.#addListener(this, eventName, listener, true);
  }

  /**
   * Adds a one-time listener function for the event named eventName to the
   * beginning of the listeners array. The next time eventName is triggered,
   * this listener is removed, and then invoked.
   */
  public prependOnceListener(
    eventName: string | symbol,
    listener: GenericFunction,
  ): this {
    const wrapped: WrappedFunction = onceWrap(this, eventName, listener);
    this.prependListener(eventName, wrapped);
    return this;
  }

  /** Removes all listeners, or those of the specified eventName. */
  public removeAllListeners(eventName?: string | symbol): this {
    if (this._events === undefined) {
      return this;
    }

    if (eventName) {
      if (hasListeners(this._events, eventName)) {
        const listeners = ensureArray(this._events[eventName]).slice()
          .reverse();
        for (const listener of listeners) {
          this.removeListener(
            eventName,
            unwrapListener(listener),
          );
        }
      }
    } else {
      const eventList = this.eventNames();
      eventList.forEach((eventName: string | symbol) => {
        if (eventName === "removeListener") return;
        this.removeAllListeners(eventName);
      });
      this.removeAllListeners("removeListener");
    }

    return this;
  }

  /**
   * Removes the specified listener from the listener array for the event
   * named eventName.
   */
  public removeListener(
    eventName: string | symbol,
    listener: GenericFunction,
  ): this {
    checkListenerArgument(listener);
    if (hasListeners(this._events, eventName)) {
      const maybeArr = this._events[eventName];

      assert(maybeArr);
      const arr = ensureArray(maybeArr);

      let listenerIndex = -1;
      for (let i = arr.length - 1; i >= 0; i--) {
        // arr[i]["listener"] is the reference to the listener inside a bound 'once' wrapper
        if (
          arr[i] == listener ||
          (arr[i] && (arr[i] as WrappedFunction)["listener"] == listener)
        ) {
          listenerIndex = i;
          break;
        }
      }

      if (listenerIndex >= 0) {
        arr.splice(listenerIndex, 1);
        if (arr.length === 0) {
          delete this._events[eventName];
        } else if (arr.length === 1) {
          // If there is only one listener, an array is not necessary.
          this._events[eventName] = arr[0];
        }

        if (this._events.removeListener) {
          this.emit("removeListener", eventName, listener);
        }
      }
    }
    return this;
  }

  /**
   * By default EventEmitters will print a warning if more than 10 listeners
   * are added for a particular event. This is a useful default that helps
   * finding memory leaks. Obviously, not all events should be limited to just
   * 10 listeners. The emitter.setMaxListeners() method allows the limit to be
   * modified for this specific EventEmitter instance. The value can be set to
   * Infinity (or 0) to indicate an unlimited number of listeners.
   */
  public setMaxListeners(n: number): this {
    if (n !== Infinity) {
      validateMaxListeners(n, "n");
    }

    this.maxListeners = n;
    return this;
  }

  /**
   * Creates a Promise that is fulfilled when the EventEmitter emits the given
   * event or that is rejected when the EventEmitter emits 'error'. The Promise
   * will resolve with an array of all the arguments emitted to the given event.
   */
  public static once(
    emitter: EventEmitter | EventTarget,
    name: string,
    // deno-lint-ignore no-explicit-any
  ): Promise<any[]> {
    return new Promise((resolve, reject) => {
      if (emitter instanceof EventTarget) {
        // EventTarget does not have `error` event semantics like Node
        // EventEmitters, we do not listen to `error` events here.
        emitter.addEventListener(
          name,
          (...args) => {
            resolve(args);
          },
          { once: true, passive: false, capture: false },
        );
        return;
      } else if (emitter instanceof EventEmitter) {
        // deno-lint-ignore no-explicit-any
        const eventListener = (...args: any[]): void => {
          if (errorListener !== undefined) {
            emitter.removeListener("error", errorListener);
          }
          resolve(args);
        };
        let errorListener: GenericFunction;

        // Adding an error listener is not optional because
        // if an error is thrown on an event emitter we cannot
        // guarantee that the actual event we are waiting will
        // be fired. The result could be a silent way to create
        // memory or file descriptor leaks, which is something
        // we should avoid.
        if (name !== "error") {
          // deno-lint-ignore no-explicit-any
          errorListener = (err: any): void => {
            emitter.removeListener(name, eventListener);
            reject(err);
          };

          emitter.once("error", errorListener);
        }

        emitter.once(name, eventListener);
        return;
      }
    });
  }

  /**
   * Returns an AsyncIterator that iterates eventName events. It will throw if
   * the EventEmitter emits 'error'. It removes all listeners when exiting the
   * loop. The value returned by each iteration is an array composed of the
   * emitted event arguments.
   */
  public static on(
    emitter: EventEmitter,
    event: string | symbol,
  ): AsyncIterable {
    // deno-lint-ignore no-explicit-any
    const unconsumedEventValues: any[] = [];
    // deno-lint-ignore no-explicit-any
    const unconsumedPromises: any[] = [];
    let error: Error | null = null;
    let finished = false;

    const iterator = {
      // deno-lint-ignore no-explicit-any
      next(): Promise<IteratorResult<any>> {
        // First, we consume all unread events
        // deno-lint-ignore no-explicit-any
        const value: any = unconsumedEventValues.shift();
        if (value) {
          return Promise.resolve(createIterResult(value, false));
        }

        // Then we error, if an error happened
        // This happens one time if at all, because after 'error'
        // we stop listening
        if (error) {
          const p: Promise<never> = Promise.reject(error);
          // Only the first element errors
          error = null;
          return p;
        }

        // If the iterator is finished, resolve to done
        if (finished) {
          return Promise.resolve(createIterResult(undefined, true));
        }

        // Wait until an event happens
        return new Promise(function (resolve, reject) {
          unconsumedPromises.push({ resolve, reject });
        });
      },

      // deno-lint-ignore no-explicit-any
      return(): Promise<IteratorResult<any>> {
        emitter.removeListener(event, eventHandler);
        emitter.removeListener("error", errorHandler);
        finished = true;

        for (const promise of unconsumedPromises) {
          promise.resolve(createIterResult(undefined, true));
        }

        return Promise.resolve(createIterResult(undefined, true));
      },

      throw(err: Error): void {
        error = err;
        emitter.removeListener(event, eventHandler);
        emitter.removeListener("error", errorHandler);
      },

      // deno-lint-ignore no-explicit-any
      [Symbol.asyncIterator](): any {
        return this;
      },
    };

    emitter.on(event, eventHandler);
    emitter.on("error", errorHandler);

    return iterator;

    // deno-lint-ignore no-explicit-any
    function eventHandler(...args: any[]): void {
      const promise = unconsumedPromises.shift();
      if (promise) {
        promise.resolve(createIterResult(args, false));
      } else {
        unconsumedEventValues.push(args);
      }
    }

    // deno-lint-ignore no-explicit-any
    function errorHandler(err: any): void {
      finished = true;

      const toError = unconsumedPromises.shift();
      if (toError) {
        toError.reject(err);
      } else {
        // The next time we call next()
        error = err;
      }

      iterator.return();
    }
  }

  // The generic type here is a workaround for `TS2322 [ERROR]: Type 'EventEmitter' is not assignable to type 'this'.` error.
  static #addListener<T extends EventEmitter>(
    target: T,
    eventName: string | symbol,
    listener: GenericFunction | WrappedFunction,
    prepend: boolean,
  ): T {
    checkListenerArgument(listener);
    let events = target._events;
    if (events == null) {
      EventEmitter.#init(target);
      events = target._events;
    }

    if (events.newListener) {
      target.emit("newListener", eventName, unwrapListener(listener));
    }

    if (hasListeners(events, eventName)) {
      let listeners = events[eventName];
      if (!Array.isArray(listeners)) {
        listeners = [listeners];
        events[eventName] = listeners;
      }

      if (prepend) {
        listeners.unshift(listener);
      } else {
        listeners.push(listener);
      }
    } else if (events) {
      events[eventName] = listener;
    }

    const max = EventEmitter.#getMaxListeners(target);
    if (max > 0 && EventEmitter.#listenerCount(target, eventName) > max) {
      const warning = new MaxListenersExceededWarning(target, eventName);
      EventEmitter.#warnIfNeeded(target, eventName, warning);
    }

    return target;
  }

  static #getMaxListeners(target: EventEmitter): number {
    return target.maxListeners == null
      ? EventEmitter.defaultMaxListeners
      : target.maxListeners;
  }

  static #listenerCount(
    target: EventEmitter,
    eventName: string | symbol,
  ): number {
    if (hasListeners(target._events, eventName)) {
      const maybeListeners = target._events[eventName];
      return Array.isArray(maybeListeners) ? maybeListeners.length : 1;
    } else {
      return 0;
    }
  }

  static #warnIfNeeded(
    target: EventEmitter,
    eventName: string | symbol,
    warning: Error,
  ) {
    const listeners = target._events[eventName];
    if (listeners.warned) {
      return;
    }
    listeners.warned = true;
    console.warn(warning);

    // TODO(uki00a): Here are two problems:
    // * If `global.ts` is not imported, then `globalThis.process` will be undefined.
    // * Importing `process.ts` from this file will result in circular reference.
    // As a workaround, explicitly check for the existence of `globalThis.process`.
    // deno-lint-ignore no-explicit-any
    const maybeProcess = (globalThis as any).process;
    if (maybeProcess) {
      maybeProcess.emitWarning(warning);
    }
  }
}

function checkListenerArgument(listener: unknown): void {
  if (typeof listener !== "function") {
    throw new ERR_INVALID_ARG_TYPE("listener", "function", listener);
  }
}

function hasListeners(
  maybeEvents: EventMap | null | undefined,
  eventName: string | symbol,
): boolean {
  return maybeEvents != null && Boolean(maybeEvents[eventName]);
}

function listeners(
  events: EventMap,
  eventName: string | symbol,
  unwrap: boolean,
): GenericFunction[] {
  if (!hasListeners(events, eventName)) {
    return [];
  }

  const eventListeners = events[eventName];
  if (Array.isArray(eventListeners)) {
    return unwrap
      ? unwrapListeners(eventListeners)
      : eventListeners.slice(0) as GenericFunction[];
  } else {
    return [
      unwrap ? unwrapListener(eventListeners) : eventListeners,
    ] as GenericFunction[];
  }
}

function unwrapListeners(
  arr: (GenericFunction | WrappedFunction)[],
): GenericFunction[] {
  const unwrappedListeners = new Array(arr.length) as GenericFunction[];
  for (let i = 0; i < arr.length; i++) {
    unwrappedListeners[i] = unwrapListener(arr[i]);
  }
  return unwrappedListeners;
}

function unwrapListener(
  listener: GenericFunction | WrappedFunction,
): GenericFunction {
  return (listener as WrappedFunction)["listener"] ?? listener;
}

// Wrapped function that calls EventEmitter.removeListener(eventName, self) on execution.
function onceWrap(
  target: EventEmitter,
  eventName: string | symbol,
  listener: GenericFunction,
): WrappedFunction {
  checkListenerArgument(listener);
  const wrapper = function (
    this: {
      eventName: string | symbol;
      listener: GenericFunction;
      rawListener: GenericFunction | WrappedFunction;
      context: EventEmitter;
      isCalled?: boolean;
    },
    // deno-lint-ignore no-explicit-any
    ...args: any[]
  ): void {
    // If `emit` is called in listeners, the same listener can be called multiple times.
    // To prevent that, check the flag here.
    if (this.isCalled) {
      return;
    }
    this.context.removeListener(
      this.eventName,
      this.listener as GenericFunction,
    );
    this.isCalled = true;
    return this.listener.apply(this.context, args);
  };
  const wrapperContext = {
    eventName: eventName,
    listener: listener,
    rawListener: (wrapper as unknown) as WrappedFunction,
    context: target,
  };
  const wrapped = (wrapper.bind(
    wrapperContext,
  ) as unknown) as WrappedFunction;
  wrapperContext.rawListener = wrapped;
  wrapped.listener = listener;
  return wrapped as WrappedFunction;
}

// EventEmitter#on should point to the same function as EventEmitter#addListener.
EventEmitter.prototype.on = EventEmitter.prototype.addListener;
// EventEmitter#off should point to the same function as EventEmitter#removeListener.
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

class MaxListenersExceededWarning extends Error {
  readonly count: number;
  constructor(
    readonly emitter: EventEmitter,
    readonly type: string | symbol,
  ) {
    const listenerCount = emitter.listenerCount(type);
    const message = "Possible EventEmitter memory leak detected. " +
      `${listenerCount} ${
        type == null ? "null" : type.toString()
      } listeners added to [${emitter.constructor.name}]. ` +
      " Use emitter.setMaxListeners() to increase limit";
    super(message);
    this.count = listenerCount;
    this.name = "MaxListenersExceededWarning";
  }
}

makeMethodsEnumerable(EventEmitter);

export default Object.assign(EventEmitter, { EventEmitter, setMaxListeners });

export const captureRejectionSymbol = EventEmitter.captureRejectionSymbol;
export const errorMonitor = EventEmitter.errorMonitor;
export const listenerCount = EventEmitter.listenerCount;
export const on = EventEmitter.on;
export const once = EventEmitter.once;
