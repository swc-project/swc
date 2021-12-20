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
// @target: es2017
// @noEmitHelpers: true
class A {
    x() {
    }
    y() {
    }
}
class B extends A {
    // async method with only call/get on 'super' does not require a binding
    simple() {
        var _super_x = (..._args)=>super.x(..._args)
        , _super_y = (..._args)=>super.y(..._args)
        , _super_method = (..._args)=>super["x"](..._args)
        , _super_x1 = ()=>super.x
        , _super_method1 = ()=>super["x"]
        ;
        return _asyncToGenerator(function*() {
            // call with property access
            _super_x();
            // call additional property.
            _super_y();
            // call with element access
            _super_method();
            // property access (read)
            const a = _super_x1();
            // element access (read)
            const b = _super_method1();
        })();
    }
    // async method with assignment/destructuring on 'super' requires a binding
    advanced() {
        var _super_x = (..._args)=>super.x(..._args)
        , _super_method = (..._args)=>super["x"](..._args)
        , _super_x2 = ()=>super.x
        , _super_method2 = ()=>super["x"]
        , _super_x3 = (_args)=>// property access (assign)
            super.x = _args
        , _super_method3 = (_args)=>// element access (assign)
            super["x"] = _args
        , _super_x4 = ()=>super.x
        , _super_method4 = ()=>super["x"]
        ;
        return _asyncToGenerator(function*() {
            const f = ()=>{
            };
            // call with property access
            _super_x();
            // call with element access
            _super_method();
            // property access (read)
            const a = _super_x2();
            // element access (read)
            const b = _super_method2();
            _super_x3(f);
            _super_method3(f);
            // destructuring assign with property access
            ({ f: _super_x4()  } = {
                f
            });
            // destructuring assign with element access
            ({ f: _super_method4()  } = {
                f
            });
        })();
    }
}
