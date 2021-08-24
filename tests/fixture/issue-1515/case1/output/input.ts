"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
class ServiceError extends Error {
    constructor(...args){
        super(...args);
        this.code = ServiceError.Code.badResponse;
        this.name = "ServiceError.BadResponse";
    }
}
exports.ServiceError = ServiceError;
(function(ServiceError1) {
    var Code;
    (function(Code1) {
        Code1[Code1["serviceNotFound"] = 404] = "serviceNotFound";
        Code1[Code1["serviceNotCompatible"] = 426] = "serviceNotCompatible";
        Code1[Code1["serviceGone"] = 410] = "serviceGone";
        Code1[Code1["implementation"] = 500] = "implementation";
        Code1[Code1["timedOut"] = 504] = "timedOut";
        Code1[Code1["badRequest"] = 400] = "badRequest";
        Code1[Code1["badResponse"] = 422] = "badResponse";
    })(Code || (Code = {
    }));
    class ServiceNotFound extends ServiceError {
        constructor(...args1){
            super(...args1);
            // Service was probably not registered, or using the wrong channel
            this.code = Code.serviceNotFound;
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
    ServiceError1.Code = Code;
})(ServiceError || (ServiceError = {
}));
