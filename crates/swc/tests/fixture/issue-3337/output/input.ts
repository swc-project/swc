"use strict";
var joiful = _interopRequireWildcard(require("joiful"));
function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object.keys(descriptor).forEach(function(key) {
        desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;
    if ("value" in desc || desc.initializer) {
        desc.writable = true;
    }
    desc = decorators.slice().reverse().reduce(function(desc, decorator) {
        return decorator ? decorator(target, property, desc) || desc : desc;
    }, desc);
    if (context && desc.initializer !== void 0) {
        desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
        desc.initializer = undefined;
    }
    if (desc.initializer === void 0) {
        Object.defineProperty(target, property, desc);
        desc = null;
    }
    return desc;
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _initializerDefineProperty(target, property, descriptor, context) {
    if (!descriptor) return;
    var own = Object.getOwnPropertyDescriptor(target, property) || Object.getOwnPropertyDescriptor(Object.getPrototypeOf(target), property);
    if (own && (own.get || own.set)) return;
    Object.defineProperty(target, property, {
        enumerable: descriptor.enumerable,
        configurable: descriptor.configurable,
        writable: descriptor.writable,
        value: descriptor.initializer ? descriptor.initializer.call(context) : own && own.value !== void 0 ? own.value : void 0
    });
}
function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {};
        if (obj != null) {
            for(var key in obj){
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {};
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
var _class, _descriptor, _dec, _dec1;
var Schema = ((_class = function Schema() {
    "use strict";
    _classCallCheck(this, Schema);
    _initializerDefineProperty(this, "id", _descriptor, this);
}) || _class, _dec = joiful.string().guid().required(), _dec1 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", String), _descriptor = _applyDecoratedDescriptor(_class.prototype, "id", [
    _dec,
    _dec1
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
}), _class);
