//// [foo.js]
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
function testPromise1() {
    console.log("Nope");
}
function testPromise2() {
    return _testPromise2.apply(this, arguments);
}
function _testPromise2() {
    return (_testPromise2 = _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2,
                "asd"
            ];
        });
    })).apply(this, arguments);
}
var testPromise3 = function() {
    console.log("test");
}, testPromise4 = function() {
    console.log("test");
};
function testNever1() {}
function testNever2() {
    return _testNever2.apply(this, arguments);
}
function _testNever2() {
    return (_testNever2 = _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2,
                "asd"
            ];
        });
    })).apply(this, arguments);
}
var testNever3 = function() {
    console.log("test");
}, testNever4 = function() {
    console.log("test");
};
