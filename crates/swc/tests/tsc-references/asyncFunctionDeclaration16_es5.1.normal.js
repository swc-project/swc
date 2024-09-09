//// [asyncFunctionDeclaration16_es5.ts]
//// [/types.d.ts]
//// [/a.js]
/**
 * @callback T1
 * @param {string} str
 * @returns {string}
 */ /**
 * @callback T2
 * @param {string} str
 * @returns {Promise<string>}
 */ /**
 * @callback T3
 * @param {string} str
 * @returns {Thenable}
 */ /**
 * @param {string} str
 * @returns {string}
 */ import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
var f1 = /*#__PURE__*/ function() {
    var _ref = _async_to_generator(function(str) {
        return _ts_generator(this, function(_state) {
            return [
                2,
                str
            ];
        });
    });
    return function f1(str) {
        return _ref.apply(this, arguments);
    };
}();
/** @type {T1} */ var f2 = /*#__PURE__*/ function() {
    var _ref = _async_to_generator(function(str) {
        return _ts_generator(this, function(_state) {
            return [
                2,
                str
            ];
        });
    });
    return function f2(str) {
        return _ref.apply(this, arguments);
    };
}();
/**
 * @param {string} str
 * @returns {Promise<string>}
 */ var f3 = /*#__PURE__*/ function() {
    var _ref = _async_to_generator(function(str) {
        return _ts_generator(this, function(_state) {
            return [
                2,
                str
            ];
        });
    });
    return function f3(str) {
        return _ref.apply(this, arguments);
    };
}();
/** @type {T2} */ var f4 = /*#__PURE__*/ function() {
    var _ref = _async_to_generator(function(str) {
        return _ts_generator(this, function(_state) {
            return [
                2,
                str
            ];
        });
    });
    return function f4(str) {
        return _ref.apply(this, arguments);
    };
}();
/** @type {T3} */ var f5 = /*#__PURE__*/ function() {
    var _ref = _async_to_generator(function(str) {
        return _ts_generator(this, function(_state) {
            return [
                2,
                str
            ];
        });
    });
    return function f5(str) {
        return _ref.apply(this, arguments);
    };
}();
