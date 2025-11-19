//// [templateInsideCallback.js]
/**
 * @typedef Oops
 * @template T
 * @property {T} a
 * @property {T} b
 */ /**
 * @callback Call
 * @template T
 * @param {T} x
 * @returns {T}
 */ /**
 * @template T
 * @type {Call<T>}
 */ import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
var identity = function(x) {
    return x;
};
/**
 * @typedef Nested
 * @property {Object} oh
 * @property {number} oh.no
 * @template T
 * @property {string} oh.noooooo
 */ /**
 * @overload
 * @template T
 * @template U
 * @param {T[]} array
 * @param {(x: T) => U[]} iterable
 * @returns {U[]}
 */ /**
 * @overload
 * @template T
 * @param {T[][]} array
 * @returns {T[]}
 */ /**
 * @param {unknown[]} array
 * @param {(x: unknown) => unknown} iterable
 * @returns {unknown[]}
 */ function flatMap(array) {
    var iterable = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : identity;
    /** @type {unknown[]} */ var result = [];
    for(var i = 0; i < array.length; i += 1){
        var _result;
        (_result = result).push.apply(_result, _to_consumable_array(/** @type {unknown[]} */ iterable(array[i])));
    }
    return result;
}
