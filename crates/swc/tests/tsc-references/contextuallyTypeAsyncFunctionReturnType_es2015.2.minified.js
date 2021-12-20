function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg), value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    info.done ? resolve(value) : Promise.resolve(value).then(_next, _throw);
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
            _next(void 0);
        });
    };
}
function _fn1() {
    return (_fn1 = _asyncToGenerator(function*() {
        return {
            key: "value"
        };
    })).apply(this, arguments);
}
function _fn2() {
    return (_fn2 = _asyncToGenerator(function*() {
        return new Promise((resolve)=>{
            resolve({
                key: "value"
            });
        });
    })).apply(this, arguments);
}
function _fn3() {
    return (_fn3 = _asyncToGenerator(function*() {
        return yield {
            key: "value"
        };
    })).apply(this, arguments);
}
function _fn4() {
    return (_fn4 = _asyncToGenerator(function*() {
        return yield new Promise((resolve)=>{
            resolve({
                key: "value"
            });
        });
    })).apply(this, arguments);
}
