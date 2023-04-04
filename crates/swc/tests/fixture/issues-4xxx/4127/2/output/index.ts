import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
function test(constructor) {
    console.log(constructor);
}
let _class = class _class {
};
_class = _ts_decorate([
    test
], _class);
export { _class as default };
