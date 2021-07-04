"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _exportNames = {
};
var _foo = _interopRequireWildcard(require("./foo"));
var _bar = _interopRequireWildcard(require("./bar"));
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
Object.keys(_foo).forEach(function(key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    if (key in exports && exports[key] === _foo[key]) return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function() {
            return _foo[key];
        }
    });
});
Object.keys(_bar).forEach(function(key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    if (key in exports && exports[key] === _bar[key]) return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function() {
            return _bar[key];
        }
    });
});
