// @allowJs: true
// @checkJs: true
// @target: es6
// @outDir: ./out
// @declaration: true
// @filename: file.js
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
var X = /*#__PURE__*/ function() {
    "use strict";
    function X() {
        _class_call_check(this, X);
    }
    var _proto = X.prototype;
    /**
      * Cancels the request, sending a cancellation to the other party
      * @param {Object} error __auto_generated__
      * @param {string?} error.reason the error reason to send the cancellation with
      * @param {string?} error.code the error code to send the cancellation with
      * @returns {Promise.<*>} resolves when the event has been sent.
      */ _proto.cancel = function cancel(param) {
        var reason = param.reason, code = param.code;
        return _async_to_generator(function() {
            return _ts_generator(this, function(_state) {
                return [
                    2
                ];
            });
        })();
    };
    return X;
}();
var Y = /*#__PURE__*/ function() {
    "use strict";
    function Y() {
        _class_call_check(this, Y);
    }
    var _proto = Y.prototype;
    /**
      * Cancels the request, sending a cancellation to the other party
      * @param {Object} error __auto_generated__
      * @param {string?} error.reason the error reason to send the cancellation with
      * @param {Object} error.suberr
      * @param {string?} error.suberr.reason the error reason to send the cancellation with
      * @param {string?} error.suberr.code the error code to send the cancellation with
      * @returns {Promise.<*>} resolves when the event has been sent.
      */ _proto.cancel = function cancel(param) {
        var reason = param.reason, suberr = param.suberr;
        return _async_to_generator(function() {
            return _ts_generator(this, function(_state) {
                return [
                    2
                ];
            });
        })();
    };
    return Y;
}();
