import _wrap_async_generator from "@swc/helpers/lib/_wrap_async_generator.js";
function f(a) {
    return _f.apply(this, arguments);
}
function _f() {
    _f = // @target: esnext,es2015,es5
    // @lib: esnext
    // @noEmitHelpers: true
    // @noTypesAndSymbols: true
    // https://github.com/microsoft/TypeScript/issues/37686
    _wrap_async_generator(function*(a) {
        var _b;
        let c = (_b = a.b) !== null && _b !== void 0 ? _b : 10;
        while(c){
            yield c--;
        }
    });
    return _f.apply(this, arguments);
}
