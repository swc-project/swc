"use strict";
require("reflect-metadata");
function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {
    };
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
    Object.defineProperty(target, property, {
        enumerable: descriptor.enumerable,
        configurable: descriptor.configurable,
        writable: descriptor.writable,
        value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
}
var _class, _descriptor, _dec, _dec1;
var COL_KEY = Symbol('col');
var column = function() {
    return function(object, key) {
        Reflect.defineMetadata(COL_KEY, 'value', object, key);
    };
};
var User1 = ((_class = function User() {
    "use strict";
    _classCallCheck(this, User);
    _initializerDefineProperty(this, "currency", _descriptor, this);
}) || _class, _dec = column(), _dec1 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", String), _descriptor = _applyDecoratedDescriptor(_class.prototype, "currency", [
    _dec,
    _dec1
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: void 0
}), _class);
