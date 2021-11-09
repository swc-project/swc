import { SafeSubscriber, Subscriber } from './Subscriber';
import { isSubscription } from './Subscription';
import { observable as Symbol_observable } from './symbol/observable';
import { pipeFromArray } from './util/pipe';
import { config } from './config';
import { isFunction } from './util/isFunction';
var tmp = Symbol_observable;
export class Observable {
    lift(operator) {
        const observable = new Observable();
        observable.source = this;
        observable.operator = operator;
        return observable;
    }
    subscribe(observerOrNext, error, complete) {
        const subscriber = isSubscriber(observerOrNext) ? observerOrNext : new SafeSubscriber(observerOrNext, error, complete);
        if (config.useDeprecatedSynchronousErrorHandling) {
            this._deprecatedSyncErrorSubscribe(subscriber);
        } else {
            const { operator, source } = this;
            subscriber.add(operator ? operator.call(subscriber, source) : source ? this._subscribe(subscriber) : this._trySubscribe(subscriber));
        }
        return subscriber;
    }
    _deprecatedSyncErrorSubscribe(subscriber) {
        const localSubscriber = subscriber;
        localSubscriber._syncErrorHack_isSubscribing = true;
        const { operator } = this;
        if (operator) {
            subscriber.add(operator.call(subscriber, this.source));
        } else {
            try {
                subscriber.add(this._subscribe(subscriber));
            } catch (err) {
                localSubscriber.__syncError = err;
            }
        }
        let dest = localSubscriber;
        while (dest) {
            if ('__syncError' in dest) {
                try {
                    throw dest.__syncError;
                } finally {
                    subscriber.unsubscribe();
                }
            }
            dest = dest.destination;
        }
        localSubscriber._syncErrorHack_isSubscribing = false;
    }
    _trySubscribe(sink) {
        try {
            return this._subscribe(sink);
        } catch (err) {
            sink.error(err);
        }
    }
    forEach(next, promiseCtor2) {
        promiseCtor2 = getPromiseCtor(promiseCtor2);
        return new promiseCtor2((resolve, reject) => {
            let subscription;
            subscription = this.subscribe((value) => {
                try {
                    next(value);
                } catch (err) {
                    reject(err);
                    subscription?.unsubscribe();
                }
            }, reject, resolve);
        });
    }
    _subscribe(subscriber1) {
        return this.source?.subscribe(subscriber1);
    }
    [tmp]() {
        return this;
    }
    pipe(...operations) {
        return operations.length ? pipeFromArray(operations)(this) : this;
    }
    toPromise(promiseCtor1) {
        promiseCtor1 = getPromiseCtor(promiseCtor1);
        return new promiseCtor1((resolve, reject) => {
            let value;
            this.subscribe((x) => value = x
                , (err) => reject(err)
                , () => resolve(value)
            );
        });
    }
    constructor(subscribe1) {
        if (subscribe1) {
            this._subscribe = subscribe1;
        }
    }
}
Observable.create = (subscribe) => {
    return new Observable(subscribe);
};
function getPromiseCtor(promiseCtor) {
    return (promiseCtor ?? config.Promise) ?? Promise;
}
function isObserver(value) {
    return value && isFunction(value.next) && isFunction(value.error) && isFunction(value.complete);
}
function isSubscriber(value) {
    return value && value instanceof Subscriber || isObserver(value) && isSubscription(value);
}