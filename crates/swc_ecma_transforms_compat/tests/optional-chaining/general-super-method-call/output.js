"use strict";
class Base {
    method() {
        return 'Hello!';
    }
}
class Derived extends Base {
    method() {
        var _super_method;
        return (_super_method = super.method) === null || _super_method === void 0 ? void 0 : _super_method.call(this);
    }
}
