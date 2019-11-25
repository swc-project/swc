import { Operator } from '../Operator';
import { Observable } from '../Observable';
import { Subscriber } from '../Subscriber';
import { Subscription } from '../Subscription';
import { MonoTypeOperatorFunction, SubscribableOrPromise, TeardownLogic } from '../types';

import { OuterSubscriber } from '../OuterSubscriber';
import { InnerSubscriber } from '../InnerSubscriber';
import { subscribeToResult } from '../util/subscribeToResult';

/**
 * Emits a notification from the source Observable only after a particular time span
 * determined by another Observable has passed without another source emission.
 *
 * <span class="informal">It's like {@link debounceTime}, but the time span of
 * emission silence is determined by a second Observable.</span>
 *
 * ![](debounce.png)
 *
 * `debounce` delays notifications emitted by the source Observable, but drops previous
 * pending delayed emissions if a new notification arrives on the source Observable.
 * This operator keeps track of the most recent notification from the source
 * Observable, and spawns a duration Observable by calling the
 * `durationSelector` function. The notification is emitted only when the duration
 * Observable emits a notification or completes, and if no other notification was emitted on
 * the source Observable since the duration Observable was spawned. If a new
 * notification appears before the duration Observable emits, the previous notification will
 * not be emitted and a new duration is scheduled from `durationSelector` is scheduled.
 * If the completing event happens during the scheduled duration the last cached notification
 * is emitted before the completion event is forwarded to the output observable.
 * If the error event happens during the scheduled duration or after it only the error event is
 * forwarded to the output observable. The cache notification is not emitted in this case.
 *
 * Like {@link debounceTime}, this is a rate-limiting operator, and also a
 * delay-like operator since output emissions do not necessarily occur at the
 * same time as they did on the source Observable.
 *
 * ## Example
 * Emit the most recent click after a burst of clicks
 * ```ts
 * import { fromEvent, interval } from 'rxjs';
 * import { scan, debounce } from 'rxjs/operators';
 *
 * const clicks = fromEvent(document, 'click');
 * const result = clicks.pipe(
 *   scan((i) => ++i, 1),
 *   debounce((i) => interval(200 * i))
 * );
 * result.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link audit}
 * @see {@link auditTime}
 * @see {@link debounce}
 * @see {@link delay}
 * @see {@link sample}
 * @see {@link sampleTime}
 * @see {@link throttle}
 * @see {@link throttleTime}
 *
 * @param {function(value: T): SubscribableOrPromise} durationSelector A function
 * that receives a value from the source Observable, for computing the timeout
 * duration for each source value, returned as an Observable or a Promise.
 * @return {Observable} An Observable that delays the emissions of the source
 * Observable by the specified duration Observable returned by
 * `durationSelector`, and may drop some values if they occur too frequently.
 * @method debounce
 * @owner Observable
 */
export function debounce<T>(durationSelector: (value: T) => SubscribableOrPromise<any>): MonoTypeOperatorFunction<T> {
  return (source: Observable<T>) => source.lift(new DebounceOperator(durationSelector));
}

class DebounceOperator<T> implements Operator<T, T> {
  constructor(private durationSelector: (value: T) => SubscribableOrPromise<any>) {
  }

  call(subscriber: Subscriber<T>, source: any): TeardownLogic {
    return source.subscribe(new DebounceSubscriber(subscriber, this.durationSelector));
  }
}

/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class DebounceSubscriber<T, R> extends OuterSubscriber<T, R> {
  private value: T;
  private hasValue: boolean = false;
  private durationSubscription: Subscription = null;

  constructor(destination: Subscriber<R>,
              private durationSelector: (value: T) => SubscribableOrPromise<any>) {
    super(destination);
  }

  protected _next(value: T): void {
    try {
      const result = this.durationSelector.call(this, value);

      if (result) {
        this._tryNext(value, result);
      }
    } catch (err) {
      this.destination.error(err);
    }
  }

  protected _complete(): void {
    this.emitValue();
    this.destination.complete();
  }

  private _tryNext(value: T, duration: SubscribableOrPromise<any>): void {
    let subscription = this.durationSubscription;
    this.value = value;
    this.hasValue = true;
    if (subscription) {
      subscription.unsubscribe();
      this.remove(subscription);
    }

    subscription = subscribeToResult(this, duration);
    if (subscription && !subscription.closed) {
      this.add(this.durationSubscription = subscription);
    }
  }

  notifyNext(outerValue: T, innerValue: R,
             outerIndex: number, innerIndex: number,
             innerSub: InnerSubscriber<T, R>): void {
    this.emitValue();
  }

  notifyComplete(): void {
    this.emitValue();
  }

  emitValue(): void {
    if (this.hasValue) {
      const value = this.value;
      const subscription = this.durationSubscription;
      if (subscription) {
        this.durationSubscription = null;
        subscription.unsubscribe();
        this.remove(subscription);
      }
      // This must be done *before* passing the value
      // along to the destination because it's possible for
      // the value to synchronously re-enter this operator
      // recursively if the duration selector Observable
      // emits synchronously
      this.value = null;
      this.hasValue = false;
      super._next(value);
    }
  }
}
