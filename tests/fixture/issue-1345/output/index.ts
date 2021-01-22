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
        return decorator(target, property, desc) || desc;
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
var _class, _descriptor, _descriptor1, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7;
var _dec = ViewColumn({
    name: "tmcode"
}), _dec1 = ViewColumn({
    name: "mid"
}), _dec2 = ViewColumn({
    name: "accea"
}), _dec3 = ViewColumn({
    name: "qaccea"
}), _dec4 = ViewColumn({
    name: "endday"
}), _dec5 = ViewColumn({
    name: "quick_endday"
}), _dec6 = ViewColumn(), _dec7 = ViewColumn(), _dec8 = ViewEntity({
    name: "AccountMemberView",
    expression: "\n    SELECT\n        m.tmcode, m.mid, m.accea, m.qaccea, m.endday, m.quick_endday,\n        (SELECT COUNT(*) FROM TBLACCOUNT a WHERE m.mid = a.mid AND a.use_quick=\"F\") as accountCnt,\n        (SELECT COUNT(*) FROM TBLACCOUNT a WHERE m.mid = a.mid AND a.use_quick=\"T\") as accountQuickCnt\n    FROM TBLMEMBER m\n    "
});
export var AccountMemberView = _class = _dec8((_class = function() {
    var AccountMemberView1 = function AccountMemberView1() {
        "use strict";
        _classCallCheck(this, AccountMemberView1);
        _initializerDefineProperty(this, "memberId", _descriptor, this);
        _initializerDefineProperty(this, "mallId", _descriptor1, this);
        _initializerDefineProperty(this, "allowAccountCnt", _descriptor2, this);
        _initializerDefineProperty(this, "allowQuickAccountCnt", _descriptor3, this);
        _initializerDefineProperty(this, "accountEnddedAt", _descriptor4, this);
        _initializerDefineProperty(this, "accountQuickEnddedAt", _descriptor5, this);
        _initializerDefineProperty(this, "accountCnt", _descriptor6, this);
        _initializerDefineProperty(this, "accountQuickCnt", _descriptor7, this);
    };
    return AccountMemberView1;
}(), _descriptor = _applyDecoratedDescriptor(_class.prototype, "memberId", [
    _dec,
    typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", Number)
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: void 0
}), _descriptor1 = _applyDecoratedDescriptor(_class.prototype, "mallId", [
    _dec1,
    typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", String)
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: void 0
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "allowAccountCnt", [
    _dec2,
    typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", Number)
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: void 0
}), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, "allowQuickAccountCnt", [
    _dec3,
    typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", Number)
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: void 0
}), _descriptor4 = _applyDecoratedDescriptor(_class.prototype, "accountEnddedAt", [
    _dec4,
    typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", typeof Date === "undefined" ? Object : Date)
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: void 0
}), _descriptor5 = _applyDecoratedDescriptor(_class.prototype, "accountQuickEnddedAt", [
    _dec5,
    typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", typeof Date === "undefined" ? Object : Date)
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: void 0
}), _descriptor6 = _applyDecoratedDescriptor(_class.prototype, "accountCnt", [
    _dec6,
    typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", Number)
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: void 0
}), _descriptor7 = _applyDecoratedDescriptor(_class.prototype, "accountQuickCnt", [
    _dec7,
    typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", Number)
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: void 0
}), _class)) || _class;
