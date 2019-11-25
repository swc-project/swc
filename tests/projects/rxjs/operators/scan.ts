import { Operator } from '../Operator';
import { Observable } from '../Observable';
import { Subscriber } from '../Subscriber';
import { OperatorFunction, TeardownLogic } from '../types';

/* tslint:disable:max-line-length */
export function scan<V, A = V>(accumulator: (acc: A|V, value: V, index: number) => A): OperatorFunction<V, V|A>;
export function scan<V, A>(accumulator: (acc: A, value: V, index: number) => A, seed: A): OperatorFunction<V, A>;
export function scan<V, A, S>(accumulator: (acc: A|S, value: V, index: number) => A, seed: S): OperatorFunction<V, A>;
/* tslint:enable:max-line-length */

/**
 * Applies an accumulator function over the source Observable, and returns each
 * intermediate result, with an optional seed value.
 *
 * <span class="informal">It's like {@link reduce}, but emits the current
 * accumulation whenever the source emits a value.</span>
 *
 * ![](scan.png)
 *
 * Combines together all values emitted on the source, using an accumulator
 * function that knows how to join a new source value into the accumulation from
 * the past. Is similar to {@link reduce}, but emits the intermediate
 * accumulations.
 *
 * Returns an Observable that applies a specified `accumulator` function to each
 * item emitted by the source Observable. If a `seed` value is specified, then
 * that value will be used as the initial value for the accumulator. If no seed
 * value is specified, the first item of the source is used as the seed.
 *
 * ## Example
 * Count the number of click events
 * ```ts
 * import { fromEvent } from 'rxjs';
 * import { scan, mapTo } from 'rxjs/operators';
 *
 * const clicks = fromEvent(document, 'click');
 * const ones = clicks.pipe(mapTo(1));
 * const seed = 0;
 * const count = ones.pipe(scan((acc, one) => acc + one, seed));
 * count.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link expand}
 * @see {@link mergeScan}
 * @see {@link reduce}
 *
 * @param {function(acc: A, value: V, index: number): A} accumulator
 * The accumulator function called on each source value.
 * @param {V|A} [seed] The initial accumulation value.
 * @return {Observable<A>} An observable of the accumulated values.
 * @method scan
 * @owner Observable
 */
export function scan<V, A, S>(accumulator: (acc: V|A|S, value: V, index: number) => A, seed?: S): OperatorFunction<V, V|A> {
  let hasSeed = false;
  // providing a seed of `undefined` *should* be valid and trigger
  // hasSeed! so don't use `seed !== undefined` checks!
  // For this reason, we have to check it here at the original call site
  // otherwise inside Operator/Subscriber we won't know if `undefined`
  // means they didn't provide anything or if they literally provided `undefined`
  if (arguments.length >= 2) {
    hasSeed = true;
  }

  return function scanOperatorFunction(source: Observable<V>) {
    return source.lift(new ScanOperator(accumulator, seed, hasSeed));
  };
}

class ScanOperator<V, A, S> implements Operator<V, A> {
  constructor(private accumulator: (acc: V|A|S, value: V, index: number) => A, private seed?: S, private hasSeed: boolean = false) {}

  call(subscriber: Subscriber<A>, source: any): TeardownLogic {
    return source.subscribe(new ScanSubscriber(subscriber, this.accumulator, this.seed, this.hasSeed));
  }
}

/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class ScanSubscriber<V, A> extends Subscriber<V> {
  private index: number = 0;

  constructor(destination: Subscriber<A>, private accumulator: (acc: V|A, value: V, index: number) => A, private _state: any,
              private _hasState: boolean) {
    super(destination);
  }

  protected _next(value: V): void {
    const { destination } = this;
    if (!this._hasState) {
      this._state = value;
      this._hasState = true;
      destination.next(value);
    } else {
      const index = this.index++;
      let result: A;
      try {
        result = this.accumulator(this._state, value, index);
      } catch (err) {
        destination.error(err);
        return;
      }
      this._state = result;
      destination.next(result);
    }
  }
}
