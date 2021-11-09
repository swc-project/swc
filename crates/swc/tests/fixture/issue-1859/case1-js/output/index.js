"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _exportNames = {
};
var _appConfig = _interopRequireWildcard(require("./app.config"));
Object.keys(_appConfig).forEach(function(key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    if (key in exports && exports[key] === _appConfig[key]) return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function() {
            return _appConfig[key];
        }
    });
});
var _databaseConfig = _interopRequireWildcard(require("./database.config"));
Object.keys(_databaseConfig).forEach(function(key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    if (key in exports && exports[key] === _databaseConfig[key]) return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function() {
            return _databaseConfig[key];
        }
    });
});
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
