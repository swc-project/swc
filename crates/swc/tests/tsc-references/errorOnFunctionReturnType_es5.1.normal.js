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
// @noEmit: true
// @allowJs: true
// @checkJs: true
// @Filename: foo.js
/**
 * @callback FunctionReturningPromise
 * @returns {Promise<number>}
 */ /** @type {FunctionReturningPromise} */ function testPromise1() {
    console.log("Nope");
}
function testPromise2() {
    return _testPromise2.apply(this, arguments);
}
function _testPromise2() {
    _testPromise2 = /** @type {FunctionReturningPromise} */ _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    return _ctx.abrupt("return", "asd");
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
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
    _testNever2 = /** @type {FunctionReturningNever} */ _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    return _ctx.abrupt("return", "asd");
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _testNever2.apply(this, arguments);
}
var testNever3 = /** @type {FunctionReturningNever} */ function testNever3() {
    console.log("test");
};
/** @type {FunctionReturningNever} */ var testNever4 = function testNever4() {
    console.log("test");
};
