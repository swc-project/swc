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
// @target: ES5
// @lib: es5,es2015.promise
// @noEmitHelpers: true
class C {
    method() {
        function other() {
        }
        function fn() {
            return _fn.apply(this, arguments);
        }
        function _fn() {
            _fn = _asyncToGenerator((function*() {
                yield other.apply(this, arguments);
            }).bind(this));
            return _fn.apply(this, arguments);
        }
    }
}
