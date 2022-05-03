"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var swcHelpers = require("@swc/helpers");
const CD = ()=>{};
const PD = ()=>{};
@CD
class ServiceError extends Error {
    constructor(...args){
        super(...args);
        this.code = ServiceError.Code.badResponse;
        this.name = "ServiceError.BadResponse";
    }
}
exports.ServiceError = ServiceError;
swcHelpers.__decorate([
    PD
], ServiceError.prototype, "code", void 0);
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
        constructor(...args){
            super(...args);
            this.code = 404;
            this.name = "ServiceError.ServiceNotFound";
        }
    }
    ServiceError1.ServiceNotFound = ServiceNotFound;
    function toMessageBody(error) {
        return {
            code: ServiceError.Code.implementation
        };
    }
    ServiceError1.toMessageBody = toMessageBody;
})(ServiceError || (ServiceError = {}));
