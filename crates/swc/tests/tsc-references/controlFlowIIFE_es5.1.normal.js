import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import regeneratorRuntime from "regenerator-runtime";
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
    regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    _ctx.next = 2;
                    return 1;
                case 2:
                    v = 1;
                case 3:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    })();
    v; // still undefined
}
function f6() {
    var v;
    _async_to_generator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    _ctx.next = 2;
                    return 1;
                case 2:
                    v = _ctx.sent;
                case 3:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }))();
    v; // still undefined
}
