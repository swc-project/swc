import regeneratorRuntime from "regenerator-runtime";
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _asyncToGenerator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
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
    throw new Error('Test is not defined');
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
    _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
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
