import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
var X = // @allowJs: true
// @checkJs: true
// @target: es6
// @outDir: ./out
// @declaration: true
// @filename: file.js
/*#__PURE__*/ function() {
    "use strict";
    function X() {
        swcHelpers.classCallCheck(this, X);
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
        return swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_ctx) {
                while(1)switch(_ctx.prev = _ctx.next){
                    case 0:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }))();
    };
    return X;
}();
var Y = /*#__PURE__*/ function() {
    "use strict";
    function Y() {
        swcHelpers.classCallCheck(this, Y);
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
        return swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_ctx) {
                while(1)switch(_ctx.prev = _ctx.next){
                    case 0:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }))();
    };
    return Y;
}();
