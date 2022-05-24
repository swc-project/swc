import _ts_decorate from "@swc/helpers/lib/_ts_decorate.js";
function test(constructor) {
    console.log(constructor);
}
let _class = class _class {
};
_class = _ts_decorate([
    test
], _class);
export { _class as default };
