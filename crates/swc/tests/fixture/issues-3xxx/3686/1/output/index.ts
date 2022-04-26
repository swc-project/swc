"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ServiceError = void 0;
var swcHelpers = require("@swc/helpers");
var _class, _descriptor;
const CD = ()=>{};
const PD = ()=>{};
let ServiceError = _class = CD(((_class = class ServiceError extends Error {
    name = "ServiceError.BadResponse";
    constructor(...args){
        super(...args);
        swcHelpers.initializerDefineProperty(this, "code", _descriptor, this);
    }
}) || _class, _descriptor = swcHelpers.applyDecoratedDescriptor(_class.prototype, "code", [
    PD
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function() {
        return ServiceError.Code.badResponse;
    }
}), _class)) || _class;
exports.ServiceError = ServiceError;
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
