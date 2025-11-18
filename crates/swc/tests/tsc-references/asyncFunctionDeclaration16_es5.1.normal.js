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
 */ var f1 = function(str) {
    return _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2,
                str
            ];
        });
    })();
};
/** @type {T1} */ var f2 = function(str) {
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
 */ var f3 = function(str) {
    return _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2,
                str
            ];
        });
    })();
};
/** @type {T2} */ var f4 = function(str) {
    return _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2,
                str
            ];
        });
    })();
};
/** @type {T3} */ var f5 = function(str) {
    return _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2,
                str
            ];
        });
    })();
};
