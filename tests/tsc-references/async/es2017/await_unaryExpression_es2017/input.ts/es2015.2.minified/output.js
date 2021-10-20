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
function _bar() {
    return (_bar = _asyncToGenerator(function*() {
        yield 42;
    })).apply(this, arguments);
}
function _bar1() {
    return (_bar1 = _asyncToGenerator(function*() {
        yield 42;
    })).apply(this, arguments);
}
function _bar3() {
    return (_bar3 = _asyncToGenerator(function*() {
        yield 42;
    })).apply(this, arguments);
}
function _bar4() {
    return (_bar4 = _asyncToGenerator(function*() {
        yield 42;
    })).apply(this, arguments);
}
