// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { unitTest, assertThrows } from "./test_util.ts";
unitTest(function streamReadableHwmError() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var invalidHwm = [
        NaN,
        Number("NaN"),
        {},
        -1,
        "two"
    ];
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        var _loop = function() {
            var highWaterMark = _step.value;
            assertThrows(function() {
                new ReadableStream(undefined, {
                    highWaterMark: highWaterMark
                });
            }, RangeError, "highWaterMark must be a positive number or Infinity.  Received:");
        };
        for(var _iterator = invalidHwm[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true)_loop();
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
    assertThrows(function() {
        new ReadableStream(undefined, // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {
            highWaterMark: Symbol("hwk")
        });
    }, TypeError);
});
unitTest(function streamWriteableHwmError() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var invalidHwm = [
        NaN,
        Number("NaN"),
        {},
        -1,
        "two"
    ];
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        var _loop = function() {
            var highWaterMark = _step.value;
            assertThrows(function() {
                new WritableStream(undefined, new CountQueuingStrategy({
                    highWaterMark: highWaterMark
                }));
            }, RangeError, "highWaterMark must be a positive number or Infinity.  Received:");
        };
        for(var _iterator = invalidHwm[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true)_loop();
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
    assertThrows(function() {
        new WritableStream(undefined, // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new CountQueuingStrategy({
            highWaterMark: Symbol("hwmk")
        }));
    }, TypeError);
});
unitTest(function streamTransformHwmError() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var invalidHwm = [
        NaN,
        Number("NaN"),
        {},
        -1,
        "two"
    ];
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        var _loop = function() {
            var highWaterMark = _step.value;
            assertThrows(function() {
                new TransformStream(undefined, undefined, {
                    highWaterMark: highWaterMark
                });
            }, RangeError, "highWaterMark must be a positive number or Infinity.  Received:");
        };
        for(var _iterator = invalidHwm[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true)_loop();
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
    assertThrows(function() {
        new TransformStream(undefined, undefined, // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {
            highWaterMark: Symbol("hwmk")
        });
    }, TypeError);
});
