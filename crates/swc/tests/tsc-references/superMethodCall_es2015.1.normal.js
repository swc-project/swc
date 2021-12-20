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
// @strict: true
// @target: ES6
class Base {
    method() {
    }
}
class Derived extends Base {
    method() {
        var ref;
        return (ref = super.method) === null || ref === void 0 ? void 0 : ref.call(this);
    }
    asyncMethod() {
        var _super_method = ()=>super.method
        ;
        return _asyncToGenerator((function*() {
            var ref;
            return (ref = _super_method()) === null || ref === void 0 ? void 0 : ref.call(this);
        }).bind(this))();
    }
}
