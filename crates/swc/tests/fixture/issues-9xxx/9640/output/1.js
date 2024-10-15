var _ts_decorate = require("@swc/helpers/_/_ts_decorate");
var _ts_metadata = require("@swc/helpers/_/_ts_metadata");
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
_ts_decorate._([
    computed(),
    _ts_metadata._("design:type", void 0),
    _ts_metadata._("design:paramtypes", [])
], User.prototype, "fullName", null);
