import { Observable } from '../Observable';
import { ReplaySubject } from '../ReplaySubject';
import { Subscription } from '../Subscription';
import { MonoTypeOperatorFunction, SchedulerLike } from '../types';
import { Subscriber } from '../Subscriber';

export interface ShareReplayConfig {
  bufferSize?: number;
  windowTime?: number;
  refCount: boolean;
  scheduler?: SchedulerLike;
}

export function shareReplay<T>(config: ShareReplayConfig): MonoTypeOperatorFunction<T>;
export function shareReplay<T>(bufferSize?: number, windowTime?: number, scheduler?: SchedulerLike): MonoTypeOperatorFunction<T>;

/**
 * Share source and replay specified number of emissions on subscription.
 *
 * This operator is a specialization of `replay` that connects to a source observable
 * and multicasts through a `ReplaySubject` constructed with the specified arguments.
 * A successfully completed source will stay cached in the `shareReplayed observable` forever,
 * but an errored source can be retried.
 *
 * ## Why use shareReplay?
 * You generally want to use `shareReplay` when you have side-effects or taxing computations
 * that you do not wish to be executed amongst multiple subscribers.
 * It may also be valuable in situations where you know you will have late subscribers to
 * a stream that need access to previously emitted values.
 * This ability to replay values on subscription is what differentiates {@link share} and `shareReplay`.
 *
 * ![](shareReplay.png)
 *
 * ## Reference counting
 * As of RXJS version 6.4.0 a new overload signature was added to allow for manual control over what
 * happens when the operators internal reference counter drops to zero.
 * If `refCount` is true, the source will be unsubscribed from once the reference count drops to zero, i.e.
 * the inner `ReplaySubject` will be unsubscribed. All new subscribers will receive value emissions from a
 * new `ReplaySubject` which in turn will cause a new subscription to the source observable.
 * If `refCount` is false on the other hand, the source will not be unsubscribed meaning that the inner
 * `ReplaySubject` will still be subscribed to the source (and potentially run for ever).
 *
 * ## Example
 * ```ts
 * import { interval } from 'rxjs';
 * import { shareReplay, take } from 'rxjs/operators';
 *
 * const obs$ = interval(1000);
 * const shared$ = obs$.pipe(
 *   take(4),
 *   shareReplay(3)
 * );
 * shared$.subscribe(x => console.log('sub A: ', x));
 * shared$.subscribe(y => console.log('sub B: ', y));
 *
 * ```
 *
 * ## Example for refCount usage
 * ```ts
 * // Code take from https://blog.angularindepth.com/rxjs-whats-changed-with-sharereplay-65c098843e95
 * // and adapted to showcase the refCount property.
 * import { interval, Observable, defer } from 'rxjs';
 * import { shareReplay, take, tap, finalize } from 'rxjs/operators';
 *
 * const log = <T>(source: Observable<T>, name: string) => defer(() => {
 *   console.log(`${name}: subscribed`);
 *   return source.pipe(
 *     tap({
 *       next: value => console.log(`${name}: ${value}`),
 *       complete: () => console.log(`${name}: complete`)
 *     }),
 *     finalize(() => console.log(`${name}: unsubscribed`))
 *   );
 * });
 *
 * const obs$ = log(interval(1000), 'source');
 *
 * const shared$ = log(obs$.pipe(
 *   shareReplay({bufferSize: 1, refCount: true }),
 *   take(2),
 * ), 'shared');
 *
 * shared$.subscribe(x => console.log('sub A: ', x));
 * shared$.subscribe(y => console.log('sub B: ', y));
 *
 * // PRINTS:
 * // shared: subscribed <-- reference count = 1
 * // source: subscribed
 * // shared: subscribed <-- reference count = 2
 * // source: 0
 * // shared: 0
 * // sub A: 0
 * // shared: 0
 * // sub B: 0
 * // source: 1
 * // shared: 1
 * // sub A: 1
 * // shared: complete <-- take(2) completes the subscription for sub A
 * // shared: unsubscribed <-- reference count = 1
 * // shared: 1
 * // sub B: 1
 * // shared: complete <-- take(2) completes the subscription for sub B
 * // shared: unsubscribed <-- reference count = 0
 * // source: unsubscribed <-- replaySubject unsubscribes from source observable because the reference count dropped to 0 and refCount is true
 *
 * // In case of refCount being false, the unsubscribe is never called on the source and the source would keep on emitting, even if no subscribers
 * // are listening.
 * // source: 2
 * // source: 3
 * // source: 4
 * // ...
 * ```
 *
 * @see {@link publish}
 * @see {@link share}
 * @see {@link publishReplay}
 *
 * @param {Number} [bufferSize=Number.POSITIVE_INFINITY] Maximum element count of the replay buffer.
 * @param {Number} [windowTime=Number.POSITIVE_INFINITY] Maximum time length of the replay buffer in milliseconds.
 * @param {Scheduler} [scheduler] Scheduler where connected observers within the selector function
 * will be invoked on.
 * @return {Observable} An observable sequence that contains the elements of a sequence produced
 * by multicasting the source sequence within a selector function.
 * @method shareReplay
 * @owner Observable
 */
export function shareReplay<T>(
  configOrBufferSize?: ShareReplayConfig | number,
  windowTime?: number,
  scheduler?: SchedulerLike
): MonoTypeOperatorFunction<T> {
  let config: ShareReplayConfig;
  if (configOrBufferSize && typeof configOrBufferSize === 'object') {
    config = configOrBufferSize as ShareReplayConfig;
  } else {
    config = {
      bufferSize: configOrBufferSize as number | undefined,
      windowTime,
      refCount: false,
      scheduler
    };
  }
  return (source: Observable<T>) => source.lift(shareReplayOperator(config));
}

function shareReplayOperator<T>({
  bufferSize = Number.POSITIVE_INFINITY,
  windowTime = Number.POSITIVE_INFINITY,
  refCount: useRefCount,
  scheduler
}: ShareReplayConfig) {
  let subject: ReplaySubject<T> | undefined;
  let refCount = 0;
  let subscription: Subscription | undefined;
  let hasError = false;
  let isComplete = false;

  return function shareReplayOperation(this: Subscriber<T>, source: Observable<T>) {
    refCount++;
    if (!subject || hasError) {
      hasError = false;
      subject = new ReplaySubject<T>(bufferSize, windowTime, scheduler);
      subscription = source.subscribe({
        next(value) { subject.next(value); },
        error(err) {
          hasError = true;
          subject.error(err);
        },
        complete() {
          isComplete = true;
          subject.complete();
        },
      });
    }

    const innerSub = subject.subscribe(this);
    this.add(() => {
      refCount--;
      innerSub.unsubscribe();
      if (subscription && !isComplete && useRefCount && refCount === 0) {
        subscription.unsubscribe();
        subscription = undefined;
        subject = undefined;
      }
    });
  };
}
