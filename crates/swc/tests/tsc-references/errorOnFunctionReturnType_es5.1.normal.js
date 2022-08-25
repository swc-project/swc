// @noEmit: true
// @allowJs: true
// @checkJs: true
// @Filename: foo.js
/**
 * @callback FunctionReturningPromise
 * @returns {Promise<number>}
 */ /** @type {FunctionReturningPromise} */ import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
function testPromise1() {
    console.log("Nope");
}
function testPromise2() {
    return _testPromise2.apply(this, arguments);
}
function _testPromise2() {
    _testPromise2 = /** @type {FunctionReturningPromise} */ _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2,
                "asd"
            ];
        });
    });
    return _testPromise2.apply(this, arguments);
}
var testPromise3 = /** @type {FunctionReturningPromise} */ function testPromise3() {
    console.log("test");
};
/** @type {FunctionReturningPromise} */ var testPromise4 = function testPromise4() {
    console.log("test");
};
/**
 * @callback FunctionReturningNever
 * @returns {never}
 */ /** @type {FunctionReturningNever} */ function testNever1() {}
function testNever2() {
    return _testNever2.apply(this, arguments);
}
function _testNever2() {
    _testNever2 = /** @type {FunctionReturningNever} */ _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2,
                "asd"
            ];
        });
    });
    return _testNever2.apply(this, arguments);
}
var testNever3 = /** @type {FunctionReturningNever} */ function testNever3() {
    console.log("test");
};
/** @type {FunctionReturningNever} */ var testNever4 = function testNever4() {
    console.log("test");
};
