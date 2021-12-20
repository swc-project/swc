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
function fn1() {
    return _fn1.apply(this, arguments);
}
function _fn1() {
    _fn1 = _asyncToGenerator(function*() {
        return {
            key: "value"
        };
    });
    return _fn1.apply(this, arguments);
}
function fn2() {
    return _fn2.apply(this, arguments);
}
function _fn2() {
    _fn2 = _asyncToGenerator(function*() {
        return new Promise((resolve)=>{
            resolve({
                key: "value"
            });
        });
    });
    return _fn2.apply(this, arguments);
}
function fn3() {
    return _fn3.apply(this, arguments);
}
function _fn3() {
    _fn3 = _asyncToGenerator(function*() {
        return yield {
            key: "value"
        };
    });
    return _fn3.apply(this, arguments);
}
function fn4() {
    return _fn4.apply(this, arguments);
}
function _fn4() {
    _fn4 = _asyncToGenerator(function*() {
        return yield new Promise((resolve)=>{
            resolve({
                key: "value"
            });
        });
    });
    return _fn4.apply(this, arguments);
}
