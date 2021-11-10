// Loaded from https://deno.land/x/graphql_deno@v15.0.0/lib/subscription/mapAsyncIterator.js


import { SYMBOL_ASYNC_ITERATOR } from '../polyfills/symbols.js';

/**
 * Given an AsyncIterable and a callback function, return an AsyncIterator
 * which produces values mapped via calling the callback function.
 */
export default function mapAsyncIterator(iterable, callback, rejectCallback) {
  // $FlowFixMe
  const iteratorMethod = iterable[SYMBOL_ASYNC_ITERATOR];
  const iterator = iteratorMethod.call(iterable);
  let $return;
  let abruptClose;

  if (typeof iterator.return === 'function') {
    $return = iterator.return;

    abruptClose = error => {
      const rethrow = () => Promise.reject(error);

      return $return.call(iterator).then(rethrow, rethrow);
    };
  }

  function mapResult(result) {
    return result.done ? result : asyncMapValue(result.value, callback).then(iteratorResult, abruptClose);
  }

  let mapReject;

  if (rejectCallback) {
    // Capture rejectCallback to ensure it cannot be null.
    const reject = rejectCallback;

    mapReject = error => asyncMapValue(error, reject).then(iteratorResult, abruptClose);
  }
  /* TODO: Flow doesn't support symbols as keys:
     https://github.com/facebook/flow/issues/3258 */


  return {
    next() {
      return iterator.next().then(mapResult, mapReject);
    },

    return() {
      return $return ? $return.call(iterator).then(mapResult, mapReject) : Promise.resolve({
        value: undefined,
        done: true
      });
    },

    throw(error) {
      if (typeof iterator.throw === 'function') {
        return iterator.throw(error).then(mapResult, mapReject);
      }

      return Promise.reject(error).catch(abruptClose);
    },

    [SYMBOL_ASYNC_ITERATOR]() {
      return this;
    }

  };
}

function asyncMapValue(value, callback) {
  return new Promise(resolve => resolve(callback(value)));
}

function iteratorResult(value) {
  return {
    value,
    done: false
  };
}