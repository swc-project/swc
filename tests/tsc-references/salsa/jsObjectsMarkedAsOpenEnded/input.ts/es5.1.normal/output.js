function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
// @out: output.js
// @allowJs: true
// @filename: a.js
var variable = {
};
variable.a = 0;
var C = function C() {
    "use strict";
    _classCallCheck(this, C);
    this.initializedMember = {
    };
    this.member = {
    };
    this.member.a = 0;
};
var obj = {
    property: {
    }
};
obj.property.a = 0;
var arr = [
    {
    }
];
function getObj() {
    return {
    };
}
// @filename: b.ts
variable.a = 1;
new C().member.a = 1;
new C().initializedMember.a = 1;
obj.property.a = 1;
arr[0].a = 1;
getObj().a = 1;
