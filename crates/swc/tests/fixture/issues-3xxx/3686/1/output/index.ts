"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ServiceError = void 0;
var _ts_decorate = require("@swc/helpers/lib/_ts_decorate.js").default;
const CD = ()=>{};
const PD = ()=>{};
let ServiceError = class ServiceError extends Error {
    constructor(...args){
        super(...args);
        this.code = ServiceError.Code.badResponse;
    }
    name = "ServiceError.BadResponse";
};
exports.ServiceError = ServiceError;
_ts_decorate([
    PD
], ServiceError.prototype, "code", void 0);
exports.ServiceError = ServiceError = _ts_decorate([
    CD
], ServiceError);
(function(ServiceError1) {
    let Code;
    (function(Code) {
        Code[Code["serviceNotFound"] = 404] = "serviceNotFound";
        Code[Code["serviceNotCompatible"] = 426] = "serviceNotCompatible";
        Code[Code["serviceGone"] = 410] = "serviceGone";
        Code[Code["implementation"] = 500] = "implementation";
        Code[Code["timedOut"] = 504] = "timedOut";
        Code[Code["badRequest"] = 400] = "badRequest";
        Code[Code["badResponse"] = 422] = "badResponse";
    })(Code = ServiceError1.Code || (ServiceError1.Code = {}));
    class ServiceNotFound extends ServiceError {
        code = 404;
        name = "ServiceError.ServiceNotFound";
    }
    ServiceError1.ServiceNotFound = ServiceNotFound;
    function toMessageBody(error) {
        return {
            code: ServiceError.Code.implementation
        };
    }
    ServiceError1.toMessageBody = toMessageBody;
})(ServiceError || (exports.ServiceError = ServiceError = {}));
