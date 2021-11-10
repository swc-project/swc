// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/util/finally-mixin.js


import noop from './noop.js';

const finallyMixin = (prototype) =>
  Object.assign(prototype, {
    finally(onFinally) {
      return this.then().finally(onFinally);
    },
  });

// FYI: Support for `Promise.prototype.finally` was not introduced until Node 9.
//      Therefore, Knex will need to conditionally inject support for `.finally(..)`
//      until support for Node 8 is officially dropped.
export default Promise.prototype.finally ? finallyMixin : noop;
