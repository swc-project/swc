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
import regeneratorRuntime from "regenerator-runtime";
// @module: umd
// @target: es2015
// @filename: 0.ts
export function foo() {
    return "foo";
}
function func() {
    return _func.apply(this, arguments);
}
function _func() {
    _func = // @filename: 1.ts
    // https://github.com/microsoft/TypeScript/issues/36780
    _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var packageName, packageJson;
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    packageName = '.';
                    _ctx.next = 3;
                    return import(packageName + '/package.json');
                case 3:
                    packageJson = _ctx.sent;
                case 4:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _func.apply(this, arguments);
}
