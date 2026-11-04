import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
import { _ as _ts_metadata } from "@swc/helpers/_/_ts_metadata";
function computed() {
    return function(target) {
        console.log(target);
    };
}
let User = class User {
    get fullName() {
        return 'foo';
    }
};
_ts_decorate([
    computed(),
    _ts_metadata("design:type", void 0),
    _ts_metadata("design:paramtypes", [])
], User.prototype, "fullName", null);
