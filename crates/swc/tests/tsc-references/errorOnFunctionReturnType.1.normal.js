//// [foo.js]
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
/**
 * @callback FunctionReturningPromise
 * @returns {Promise<number>}
 */ /** @type {FunctionReturningPromise} */ function testPromise1() {
    console.log("Nope");
}
/** @type {FunctionReturningPromise} */ function testPromise2() {
    return _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2,
                "asd"
            ];
        });
    })();
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
/** @type {FunctionReturningNever} */ function testNever2() {
    return _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2,
                "asd"
            ];
        });
    })();
}
var testNever3 = /** @type {FunctionReturningNever} */ function testNever3() {
    console.log("test");
};
/** @type {FunctionReturningNever} */ var testNever4 = function testNever4() {
    console.log("test");
};
