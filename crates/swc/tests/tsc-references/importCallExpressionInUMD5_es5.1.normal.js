// @module: umd
// @target: es2015
// @filename: 0.ts
export function foo() {
    return "foo";
}
// @filename: 1.ts
// https://github.com/microsoft/TypeScript/issues/36780
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
function func() {
    return _func.apply(this, arguments);
}
function _func() {
    _func = _async_to_generator(function() {
        var packageName, packageJson;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    packageName = ".";
                    return [
                        4,
                        import(packageName + "/package.json")
                    ];
                case 1:
                    packageJson = _state.sent();
                    return [
                        2
                    ];
            }
        });
    });
    return _func.apply(this, arguments);
}
