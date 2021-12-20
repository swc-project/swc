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
// @allowJs: true
// @checkJs: true
// @noEmit: true
// @target: es2017
// @filename: file.js
// Error (good)
/** @type {function(): string} */ const a = ()=>0
;
// Error (good)
/** @type {function(): string} */ const b = _asyncToGenerator(function*() {
    return 0;
});
// No error (bad)
/** @type {function(): string} */ const c = _asyncToGenerator(function*() {
    return 0;
});
/** @type {function(function(): string): void} */ const f = (p)=>{
};
// Error (good)
f(_asyncToGenerator(function*() {
    return 0;
}));
