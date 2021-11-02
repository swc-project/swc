"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "X", {
    enumerable: true,
    get: function() {
        return _z.default;
    }
});
Object.defineProperty(exports, "Y", {
    enumerable: true,
    get: function() {
        return _z.Y;
    }
});
Object.defineProperty(exports, "X2", {
    enumerable: true,
    get: function() {
        return _z.X2;
    }
});
var _exportNames = {
    X: true,
    Y: true,
    X2: true
};
var _z = _interopRequireWildcard(require("./Z"));
Object.keys(_z).forEach(function(key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    if (key in exports && exports[key] === _z[key]) return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function() {
            return _z[key];
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
