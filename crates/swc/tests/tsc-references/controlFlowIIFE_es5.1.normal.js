// @strictNullChecks: true
// @target: ES2017
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
function f1() {
    var x = getStringOrNumber();
    if (typeof x === "string") {
        var n = function() {
            return x.length;
        }();
    }
}
function f2() {
    var x = getStringOrNumber();
    if (typeof x === "string") {
        var n = function() {
            return x.length;
        }();
    }
}
function f3() {
    var x = getStringOrNumber();
    var y;
    if (typeof x === "string") {
        var n = function(z) {
            return x.length + y + z;
        }(y = 1);
    }
}
// Repros from #8381
var maybeNumber;
(function() {
    maybeNumber = 1;
})();
maybeNumber++;
if (maybeNumber !== undefined) {
    maybeNumber++;
}
var test;
if (!test) {
    throw new Error("Test is not defined");
}
(function() {
    test.slice(1); // No error
})();
// Repro from #23565
function f4() {
    var v;
    (function() {
        v = 1;
    })();
    v;
}
function f5() {
    var v;
    (function() {
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        1
                    ];
                case 1:
                    _state.sent();
                    v = 1;
                    return [
                        2
                    ];
            }
        });
    })();
    v; // still undefined
}
function f6() {
    var v;
    _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        1
                    ];
                case 1:
                    v = _state.sent();
                    return [
                        2
                    ];
            }
        });
    })();
    v; // still undefined
}
