var M;
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
_asyncToGenerator(function*() {}), _asyncToGenerator(function*() {}), _asyncToGenerator(function*() {}), _asyncToGenerator(function*() {}), _asyncToGenerator(function*() {}), _asyncToGenerator(function*() {}), _asyncToGenerator(function*() {
    return p;
}), _asyncToGenerator(function*() {
    return mp;
}), _asyncToGenerator(function*() {
    return mp;
}), _asyncToGenerator(function*() {
    return p;
}), (function(M1) {
    function _f1() {
        return (_f1 = _asyncToGenerator(function*() {})).apply(this, arguments);
    }
    M1.f1 = function() {
        return _f1.apply(this, arguments);
    };
})(M || (M = {}));
export { };
