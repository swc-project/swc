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
// @target: es5
// @lib: esnext, dom
// @downlevelIteration: true
// https://github.com/Microsoft/TypeScript/issues/24722
class A {
    constructor(){
        this.b = _asyncToGenerator((function*(...args) {
            yield Promise.resolve();
            const obj = {
                ["a"]: ()=>this
            }; // computed property name after `await` triggers case
        }).bind(this)).bind(this);
    }
}
