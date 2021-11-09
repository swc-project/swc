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
function _bar() {
    _bar = // @target: es6
    _asyncToGenerator(function*() {
        !(yield 42); // OK
    });
    return _bar.apply(this, arguments);
}
function bar() {
    return _bar.apply(this, arguments);
}
function _bar1() {
    _bar1 = _asyncToGenerator(function*() {
        delete (yield 42); // OK
    });
    return _bar1.apply(this, arguments);
}
function bar1() {
    return _bar1.apply(this, arguments);
}
function _bar2() {
    _bar2 = _asyncToGenerator(function*() {
        delete (yield 42); // OK
    });
    return _bar2.apply(this, arguments);
}
function bar2() {
    return _bar2.apply(this, arguments);
}
function _bar3() {
    _bar3 = _asyncToGenerator(function*() {
        void (yield 42);
    });
    return _bar3.apply(this, arguments);
}
function bar3() {
    return _bar3.apply(this, arguments);
}
function _bar4() {
    _bar4 = _asyncToGenerator(function*() {
        +(yield 42);
    });
    return _bar4.apply(this, arguments);
}
function bar4() {
    return _bar4.apply(this, arguments);
}
