import * as swcHelpers from "@swc/helpers";
var _test = new WeakMap();
// @target: es2015
class C {
    test() {
        var _ref, _this_test, _ref1, _this_test1, _ref2, _ref3, _ref4, _this_test2, _ref5, _this_test3, _ref6, _ref7, _ref8, _ref9, _ref10, _ref11, _this_test4;
        swcHelpers.classPrivateFieldSet(_ref = this.getInstance(), _test, (_this_test = +swcHelpers.classPrivateFieldGet(_ref, _test)) + 1), _this_test;
        swcHelpers.classPrivateFieldSet(_ref1 = this.getInstance(), _test, (_this_test1 = +swcHelpers.classPrivateFieldGet(_ref1, _test)) - 1), _this_test1;
        swcHelpers.classPrivateFieldSet(_ref2 = this.getInstance(), _test, +swcHelpers.classPrivateFieldGet(_ref2, _test) + 1);
        swcHelpers.classPrivateFieldSet(_ref3 = this.getInstance(), _test, +swcHelpers.classPrivateFieldGet(_ref3, _test) - 1);
        const a = (swcHelpers.classPrivateFieldSet(_ref4 = this.getInstance(), _test, (_this_test2 = +swcHelpers.classPrivateFieldGet(_ref4, _test)) + 1), _this_test2);
        const b = (swcHelpers.classPrivateFieldSet(_ref5 = this.getInstance(), _test, (_this_test3 = +swcHelpers.classPrivateFieldGet(_ref5, _test)) - 1), _this_test3);
        const c = swcHelpers.classPrivateFieldSet(_ref6 = this.getInstance(), _test, +swcHelpers.classPrivateFieldGet(_ref6, _test) + 1);
        const d = swcHelpers.classPrivateFieldSet(_ref7 = this.getInstance(), _test, +swcHelpers.classPrivateFieldGet(_ref7, _test) - 1);
        for(swcHelpers.classPrivateFieldSet(this.getInstance(), _test, 0); swcHelpers.classPrivateFieldGet(_ref8 = this.getInstance(), _test) < 10; swcHelpers.classPrivateFieldSet(_ref9 = this.getInstance(), _test, +swcHelpers.classPrivateFieldGet(_ref9, _test) + 1)){}
        for(swcHelpers.classPrivateFieldSet(this.getInstance(), _test, 0); swcHelpers.classPrivateFieldGet(_ref10 = this.getInstance(), _test) < 10; swcHelpers.classPrivateFieldSet(_ref11 = this.getInstance(), _test, (_this_test4 = +swcHelpers.classPrivateFieldGet(_ref11, _test)) + 1), _this_test4){}
    }
    getInstance() {
        return new C();
    }
    constructor(){
        var _this_test, _this_test5, _this_test6, _this_test7, _this_test8;
        swcHelpers.classPrivateFieldInit(this, _test, {
            writable: true,
            value: 24
        });
        swcHelpers.classPrivateFieldSet(this, _test, (_this_test = +swcHelpers.classPrivateFieldGet(this, _test)) + 1), _this_test;
        swcHelpers.classPrivateFieldSet(this, _test, (_this_test5 = +swcHelpers.classPrivateFieldGet(this, _test)) - 1), _this_test5;
        swcHelpers.classPrivateFieldSet(this, _test, +swcHelpers.classPrivateFieldGet(this, _test) + 1);
        swcHelpers.classPrivateFieldSet(this, _test, +swcHelpers.classPrivateFieldGet(this, _test) - 1);
        const a = (swcHelpers.classPrivateFieldSet(this, _test, (_this_test6 = +swcHelpers.classPrivateFieldGet(this, _test)) + 1), _this_test6);
        const b = (swcHelpers.classPrivateFieldSet(this, _test, (_this_test7 = +swcHelpers.classPrivateFieldGet(this, _test)) - 1), _this_test7);
        const c = swcHelpers.classPrivateFieldSet(this, _test, +swcHelpers.classPrivateFieldGet(this, _test) + 1);
        const d = swcHelpers.classPrivateFieldSet(this, _test, +swcHelpers.classPrivateFieldGet(this, _test) - 1);
        for(swcHelpers.classPrivateFieldSet(this, _test, 0); swcHelpers.classPrivateFieldGet(this, _test) < 10; swcHelpers.classPrivateFieldSet(this, _test, +swcHelpers.classPrivateFieldGet(this, _test) + 1)){}
        for(swcHelpers.classPrivateFieldSet(this, _test, 0); swcHelpers.classPrivateFieldGet(this, _test) < 10; swcHelpers.classPrivateFieldSet(this, _test, (_this_test8 = +swcHelpers.classPrivateFieldGet(this, _test)) + 1), _this_test8){}
    }
}
