function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg), value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    info.done ? resolve(value) : Promise.resolve(value).then(_next, _throw);
}
export function foo() {
    return "foo";
}
export function backup() {
    return "backup";
}
function _compute() {
    return (_compute = (function(fn) {
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
                _next(void 0);
            });
        };
    })(function*(promise) {
        let j = yield promise;
        return j ? j.foo() : (j = yield import("./1")).backup();
    })).apply(this, arguments);
}
!function(promise) {
    return _compute.apply(this, arguments);
}(import("./0"));
