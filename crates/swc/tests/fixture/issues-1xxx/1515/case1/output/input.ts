"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ServiceError", {
    enumerable: true,
    get: ()=>ServiceError
});
const _defineProperty = require("@swc/helpers/lib/_define_property.js").default;
class ServiceError extends Error {
    constructor(...args){
        super(...args);
        _defineProperty(this, "code", ServiceError.Code.badResponse);
        _defineProperty(this, "name", "ServiceError.BadResponse");
    }
}
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
            // Service was probably not registered, or using the wrong channel
            _defineProperty(this, "code", 404);
            _defineProperty(this, "name", "ServiceError.ServiceNotFound");
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
