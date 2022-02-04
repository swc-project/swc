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
// @module: commonjs
// @target: es6
// @skipLibCheck: true
// @lib: es6
// @filename: foo.ts
export default "./foo";
function foo() {
    return _foo.apply(this, arguments);
}
function _foo() {
    _foo = // @filename: index.ts
    _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    _ctx.next = 2;
                    return import("./foo");
                case 2:
                    _ctx.t0 = _ctx.sent.default;
                    _ctx.next = 5;
                    return import(_ctx.t0);
                case 5:
                    return _ctx.abrupt("return", _ctx.sent);
                case 6:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _foo.apply(this, arguments);
}
