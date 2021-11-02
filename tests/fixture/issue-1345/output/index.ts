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
var _class, _descriptor, _dec, _dec1, _descriptor1, _dec2, _dec3, _descriptor2, _dec4, _dec5, _descriptor3, _dec6, _dec7, _descriptor4, _dec8, _dec9, _descriptor5, _dec10, _dec11, _descriptor6, _dec12, _dec13, _descriptor7, _dec14, _dec15;
var _dec16 = ViewEntity({
    name: "AccountMemberView",
    expression: "\n    SELECT\n        m.tmcode, m.mid, m.accea, m.qaccea, m.endday, m.quick_endday,\n        (SELECT COUNT(*) FROM TBLACCOUNT a WHERE m.mid = a.mid AND a.use_quick=\"F\") as accountCnt,\n        (SELECT COUNT(*) FROM TBLACCOUNT a WHERE m.mid = a.mid AND a.use_quick=\"T\") as accountQuickCnt\n    FROM TBLMEMBER m\n    "
});
var AccountMemberView1 = _class = _dec16((_class = function AccountMemberView() {
    "use strict";
    _classCallCheck(this, AccountMemberView);
    _initializerDefineProperty(this, "memberId", _descriptor, this);
    _initializerDefineProperty(this, "mallId", _descriptor1, this);
    _initializerDefineProperty(this, "allowAccountCnt", _descriptor2, this);
    _initializerDefineProperty(this, "allowQuickAccountCnt", _descriptor3, this);
    _initializerDefineProperty(this, "accountEnddedAt", _descriptor4, this);
    _initializerDefineProperty(this, "accountQuickEnddedAt", _descriptor5, this);
    _initializerDefineProperty(this, "accountCnt", _descriptor6, this);
    _initializerDefineProperty(this, "accountQuickCnt", _descriptor7, this);
}, _dec = ViewColumn({
    name: "tmcode"
}), _dec1 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", Number), _dec2 = ViewColumn({
    name: "mid"
}), _dec3 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", String), _dec4 = ViewColumn({
    name: "accea"
}), _dec5 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", Number), _dec6 = ViewColumn({
    name: "qaccea"
}), _dec7 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", Number), _dec8 = ViewColumn({
    name: "endday"
}), _dec9 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", typeof Date === "undefined" ? Object : Date), _dec10 = ViewColumn({
    name: "quick_endday"
}), _dec11 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", typeof Date === "undefined" ? Object : Date), _dec12 = ViewColumn(), _dec13 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", Number), _dec14 = ViewColumn(), _dec15 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", Number), _descriptor = _applyDecoratedDescriptor(_class.prototype, "memberId", [
    _dec,
    _dec1
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: void 0
}), _descriptor1 = _applyDecoratedDescriptor(_class.prototype, "mallId", [
    _dec2,
    _dec3
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: void 0
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "allowAccountCnt", [
    _dec4,
    _dec5
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: void 0
}), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, "allowQuickAccountCnt", [
    _dec6,
    _dec7
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: void 0
}), _descriptor4 = _applyDecoratedDescriptor(_class.prototype, "accountEnddedAt", [
    _dec8,
    _dec9
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: void 0
}), _descriptor5 = _applyDecoratedDescriptor(_class.prototype, "accountQuickEnddedAt", [
    _dec10,
    _dec11
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: void 0
}), _descriptor6 = _applyDecoratedDescriptor(_class.prototype, "accountCnt", [
    _dec12,
    _dec13
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: void 0
}), _descriptor7 = _applyDecoratedDescriptor(_class.prototype, "accountQuickCnt", [
    _dec14,
    _dec15
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: void 0
}), _class)) || _class;
export { AccountMemberView1 as AccountMemberView };
