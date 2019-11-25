import { concat as concatStatic } from '../observable/concat';
import { Observable } from '../Observable';
import { ObservableInput, OperatorFunction, ObservedValuesFromArray } from '../types';

export function concatWith<T>(): OperatorFunction<T, T>;
export function concatWith<T, A extends ObservableInput<any>[]>(...otherSources: A): OperatorFunction<T, ObservedValuesFromArray<A> | T>;

/**
 * Emits all of the values from the source observable, then, once it completes, subscribes
 * to each observable source provided, one at a time, emitting all of their values, and not subscribing
 * to the next one until it completes.
 *
 * `concat(a$, b$, c$)` is the same as `a$.pipe(concatWith(b$, c$))`.
 *
 * ## Example
 *
 * Listen for one mouse click, then listen for all mouse moves.
 *
 * ```ts
 * import { fromEvent } from 'rxjs';
 * import { concatWith } from 'rxjs/operators';
 *
 * const clicks$ = fromEvent(document, 'click');
 * const moves$ = fromEvent(document, 'mousemove');
 *
 * clicks$.pipe(
 *   map(() => 'click'),
 *   take(1),
 *   concatWith(
 *     moves$.pipe(
 *       map(() => 'move')
 *     )
 *   )
 * )
 * .subscribe(x => console.log(x));
 *
 * // 'click'
 * // 'move'
 * // 'move'
 * // 'move'
 * // ...
 * ```
 *
 * @param otherSources Other observable sources to subscribe to, in sequence, after the original source is complete.
 */
export function concatWith<T, A extends ObservableInput<any>[]>(...otherSources: A): OperatorFunction<T, ObservedValuesFromArray<A> | T> {
  return (source: Observable<T>) => source.lift.call(concatStatic(source, ...otherSources));
}
