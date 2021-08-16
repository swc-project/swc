"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "X", {
    enumerable: true,
    get: function() {
        return _module.default;
    }
});
Object.defineProperty(exports, "Y", {
    enumerable: true,
    get: function() {
        return _module.Y;
    }
});
Object.defineProperty(exports, "Z", {
    enumerable: true,
    get: function() {
        return _module.Z;
    }
});
var _module = _interopRequireWildcard(require("./module"));
function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {
        };
        if (obj != null) {
            for(var key in obj){
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {
                    };
                    if (desc.get || desc.set) {
                        Object.defineProperty(newObj, key, desc);
                    } else {
                        newObj[key] = obj[key];
                    }
                }
            }
        }
        newObj.default = obj;
        return newObj;
    }
}
