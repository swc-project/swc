/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var runtime = function(exports) {
    var Op;
    var hasOwn;
    var undefined; // More compressible than void 0.
    var $Symbol;
    var iteratorSymbol;
    var asyncIteratorSymbol;
    var toStringTagSymbol;
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator;
    var generator;
    var context;
    exports.wrap = null;
    var GenStateSuspendedStart;
    var GenStateSuspendedYield;
    var GenStateExecuting;
    var GenStateCompleted;
    // Returning this object from the innerFn has the same effect as
    // breaking out of the dispatch switch statement.
    var ContinueSentinel;
    // This is a polyfill for %IteratorPrototype% for environments that
    // don't natively support it.
    var IteratorPrototype;
    var getProto;
    var NativeIteratorPrototype;
    var Gp;
    exports.isGeneratorFunction = function() {
        var ctor;
    };
    exports.mark = null;
    // Within the body of any async function, `await x` is transformed to
    // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
    // `hasOwn.call(value, "__await")` to determine if the yielded value is
    // meant to be awaited.
    exports.awrap = null;
    var record;
    var result;
    var value;
    var previousPromise;
    exports.AsyncIterator = null;
    // Note that simple async functions are implemented on top of
    // AsyncIterator objects; they just return a Promise for the value of
    // the final result produced by the iterator.
    exports.async = function() {
        var iter;
        exports.isGeneratorFunction(null);
    };
    var state;
    (function invoke() {
        var delegate;
        var delegateResult;
        var record;
    });
    var method;
    var record1;
    var info;
    var entry;
    var record2;
    exports.keys = function() {
        var keys;
        var key;
        (function next() {
            var key;
        });
    };
    var iteratorMethod;
    var i, next;
    exports.values = null;
    (function() {
        var name;
    }), function() {
        var entry;
        var record;
        var thrown;
    };
    exports;
}(// If this script is executing as a CommonJS module, use module.exports
// as the regeneratorRuntime namespace. Otherwise create a new empty
// object. Either way, the resulting object will be used to initialize
// the regeneratorRuntime variable at the top of this file.
(module, module.exports));
