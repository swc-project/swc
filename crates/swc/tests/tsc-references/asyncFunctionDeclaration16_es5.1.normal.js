//// [asyncFunctionDeclaration16_es5.ts]
//// [/types.d.ts]
//// [/a.js]
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
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
 */ var f1 = function f1(str) {
    return _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2,
                str
            ];
        });
    })();
};
/** @type {T1} */ var f2 = function f2(str) {
    return _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2,
                str
            ];
        });
    })();
};
/**
 * @param {string} str
 * @returns {Promise<string>}
 */ var f3 = function f3(str) {
    return _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2,
                str
            ];
        });
    })();
};
/** @type {T2} */ var f4 = function f4(str) {
    return _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2,
                str
            ];
        });
    })();
};
/** @type {T3} */ var f5 = function f5(str) {
    return _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2,
                str
            ];
        });
    })();
};
