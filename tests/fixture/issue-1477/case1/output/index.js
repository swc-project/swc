import regeneratorRuntime from "regenerator-runtime";
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
function _f() {
    _f = _asyncToGenerator(regeneratorRuntime.mark(function _callee(a, b) {
        var a_;
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            var ref;
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    var ref1, ref2;
                    ref1 = JSON.parse(b), ref2 = ref1[0], ref = 1, a_ = ref, ref2, ref1;
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _f.apply(this, arguments);
}
function f(a, b) {
    return _f.apply(this, arguments);
}
