"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ServiceError", {
    enumerable: true,
    get: function() {
        return ServiceError;
    }
});
const _ts_decorate = require("@swc/helpers/_/_ts_decorate");
const CD = ()=>{};
const PD = ()=>{};
class ServiceError extends Error {
    code = 422;
    name = "ServiceError.BadResponse";
}
_ts_decorate._([
    PD
], ServiceError.prototype, "code", void 0);
ServiceError = _ts_decorate._([
    CD
], ServiceError);
(function(ServiceError) {
    (function(Code) {
        Code[Code["serviceNotFound"] = 404] = "serviceNotFound";
        Code[Code["serviceNotCompatible"] = 426] = "serviceNotCompatible";
        Code[Code["serviceGone"] = 410] = "serviceGone";
        Code[Code["implementation"] = 500] = "implementation";
        Code[Code["timedOut"] = 504] = "timedOut";
        Code[Code["badRequest"] = 400] = "badRequest";
        Code[Code["badResponse"] = 422] = "badResponse";
    })(ServiceError.Code || (ServiceError.Code = {}));
    class ServiceNotFound extends ServiceError {
        code = 404;
        name = "ServiceError.ServiceNotFound";
    }
    ServiceError.ServiceNotFound = ServiceNotFound;
    function toMessageBody(error) {
        return {
            code: 500
        };
    }
    ServiceError.toMessageBody = toMessageBody;
})(ServiceError || (ServiceError = {}));
