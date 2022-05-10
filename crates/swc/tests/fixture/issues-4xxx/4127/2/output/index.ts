import * as swcHelpers from "@swc/helpers";
function test(constructor) {
    console.log(constructor);
}
let _class = class _class {
};
_class = swcHelpers.__decorate([
    test
], _class);
export { _class as default };
