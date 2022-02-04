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
function f1() {
    let x = getStringOrNumber();
    if (typeof x === "string") {
        let n = function() {
            return x.length;
        }();
    }
}
function f2() {
    let x = getStringOrNumber();
    if (typeof x === "string") {
        let n = function() {
            return x.length;
        }();
    }
}
function f3() {
    let x = getStringOrNumber();
    let y;
    if (typeof x === "string") {
        let n = ((z)=>x.length + y + z
        )(y = 1);
    }
}
// Repros from #8381
let maybeNumber;
(function() {
    maybeNumber = 1;
})();
maybeNumber++;
if (maybeNumber !== undefined) {
    maybeNumber++;
}
let test;
if (!test) {
    throw new Error('Test is not defined');
}
(()=>{
    test.slice(1); // No error
})();
// Repro from #23565
function f4() {
    let v;
    (function() {
        v = 1;
    })();
    v;
}
function f5() {
    let v;
    (function*() {
        yield 1;
        v = 1;
    })();
    v; // still undefined
}
function f6() {
    let v;
    _asyncToGenerator(function*() {
        v = yield 1;
    })();
    v; // still undefined
}
