import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
var C1 = // @target: es2015
// @lib: esnext
// @filename: C1.ts
/*#__PURE__*/ function() {
    "use strict";
    function C1() {
        swcHelpers.classCallCheck(this, C1);
    }
    swcHelpers.createClass(C1, [
        {
            key: "f",
            value: function f() {
                return swcHelpers.wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
                    return regeneratorRuntime.wrap(function _callee$(_ctx) {
                        while(1)switch(_ctx.prev = _ctx.next){
                            case 0:
                            case "end":
                                return _ctx.stop();
                        }
                    }, _callee);
                }))();
            }
        }
    ]);
    return C1;
}();
var C2 = // @filename: C2.ts
/*#__PURE__*/ function() {
    "use strict";
    function C2() {
        swcHelpers.classCallCheck(this, C2);
    }
    swcHelpers.createClass(C2, [
        {
            key: "f",
            value: function f() {
                return swcHelpers.wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
                    var x;
                    return regeneratorRuntime.wrap(function _callee$(_ctx) {
                        while(1)switch(_ctx.prev = _ctx.next){
                            case 0:
                                _ctx.next = 2;
                                return;
                            case 2:
                                x = _ctx.sent;
                            case 3:
                            case "end":
                                return _ctx.stop();
                        }
                    }, _callee);
                }))();
            }
        }
    ]);
    return C2;
}();
var C3 = // @filename: C3.ts
/*#__PURE__*/ function() {
    "use strict";
    function C3() {
        swcHelpers.classCallCheck(this, C3);
    }
    swcHelpers.createClass(C3, [
        {
            key: "f",
            value: function f() {
                return swcHelpers.wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
                    var x;
                    return regeneratorRuntime.wrap(function _callee$(_ctx) {
                        while(1)switch(_ctx.prev = _ctx.next){
                            case 0:
                                _ctx.next = 2;
                                return 1;
                            case 2:
                                x = _ctx.sent;
                            case 3:
                            case "end":
                                return _ctx.stop();
                        }
                    }, _callee);
                }))();
            }
        }
    ]);
    return C3;
}();
var C4 = // @filename: C4.ts
/*#__PURE__*/ function() {
    "use strict";
    function C4() {
        swcHelpers.classCallCheck(this, C4);
    }
    swcHelpers.createClass(C4, [
        {
            key: "f",
            value: function f() {
                return swcHelpers.wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
                    var x;
                    return regeneratorRuntime.wrap(function _callee$(_ctx) {
                        while(1)switch(_ctx.prev = _ctx.next){
                            case 0:
                                return _ctx.delegateYield([
                                    1
                                ], "t0", 1);
                            case 1:
                                x = _ctx.t0;
                            case 2:
                            case "end":
                                return _ctx.stop();
                        }
                    }, _callee);
                }))();
            }
        }
    ]);
    return C4;
}();
var C5 = // @filename: C5.ts
/*#__PURE__*/ function() {
    "use strict";
    function C5() {
        swcHelpers.classCallCheck(this, C5);
    }
    swcHelpers.createClass(C5, [
        {
            key: "f",
            value: function f() {
                return swcHelpers.wrapAsyncGenerator(regeneratorRuntime.mark(function _callee1() {
                    var x;
                    return regeneratorRuntime.wrap(function _callee$(_ctx1) {
                        while(1)switch(_ctx1.prev = _ctx1.next){
                            case 0:
                                return _ctx1.delegateYield(swcHelpers.wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
                                    return regeneratorRuntime.wrap(function _callee$(_ctx) {
                                        while(1)switch(_ctx.prev = _ctx.next){
                                            case 0:
                                                _ctx.next = 2;
                                                return 1;
                                            case 2:
                                            case "end":
                                                return _ctx.stop();
                                        }
                                    }, _callee);
                                }))(), "t0", 1);
                            case 1:
                                x = _ctx1.t0;
                            case 2:
                            case "end":
                                return _ctx1.stop();
                        }
                    }, _callee1);
                }))();
            }
        }
    ]);
    return C5;
}();
var C6 = // @filename: C6.ts
/*#__PURE__*/ function() {
    "use strict";
    function C6() {
        swcHelpers.classCallCheck(this, C6);
    }
    swcHelpers.createClass(C6, [
        {
            key: "f",
            value: function f() {
                return swcHelpers.wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
                    var x;
                    return regeneratorRuntime.wrap(function _callee$(_ctx) {
                        while(1)switch(_ctx.prev = _ctx.next){
                            case 0:
                                _ctx.next = 2;
                                return swcHelpers.awaitAsyncGenerator(1);
                            case 2:
                                x = _ctx.sent;
                            case 3:
                            case "end":
                                return _ctx.stop();
                        }
                    }, _callee);
                }))();
            }
        }
    ]);
    return C6;
}();
var C7 = // @filename: C7.ts
/*#__PURE__*/ function() {
    "use strict";
    function C7() {
        swcHelpers.classCallCheck(this, C7);
    }
    swcHelpers.createClass(C7, [
        {
            key: "f",
            value: function f() {
                return swcHelpers.wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
                    return regeneratorRuntime.wrap(function _callee$(_ctx) {
                        while(1)switch(_ctx.prev = _ctx.next){
                            case 0:
                                return _ctx.abrupt("return", 1);
                            case 1:
                            case "end":
                                return _ctx.stop();
                        }
                    }, _callee);
                }))();
            }
        }
    ]);
    return C7;
}();
var C8 = // @filename: C8.ts
/*#__PURE__*/ function() {
    "use strict";
    function C8() {
        swcHelpers.classCallCheck(this, C8);
    }
    swcHelpers.createClass(C8, [
        {
            key: "g",
            value: function g() {}
        },
        {
            key: "f",
            value: function f() {
                var _this = this;
                return swcHelpers.wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
                    return regeneratorRuntime.wrap(function _callee$(_ctx) {
                        while(1)switch(_ctx.prev = _ctx.next){
                            case 0:
                                _this.g();
                            case 1:
                            case "end":
                                return _ctx.stop();
                        }
                    }, _callee);
                }))();
            }
        }
    ]);
    return C8;
}();
var B9 = // @filename: C9.ts
/*#__PURE__*/ function() {
    "use strict";
    function B9() {
        swcHelpers.classCallCheck(this, B9);
    }
    swcHelpers.createClass(B9, [
        {
            key: "g",
            value: function g() {}
        }
    ]);
    return B9;
}();
var C9 = /*#__PURE__*/ function(B9) {
    "use strict";
    swcHelpers.inherits(C9, B9);
    var _super = swcHelpers.createSuper(C9);
    function C9() {
        swcHelpers.classCallCheck(this, C9);
        return _super.apply(this, arguments);
    }
    swcHelpers.createClass(C9, [
        {
            key: "f",
            value: function f() {
                var _this = this;
                var _this1 = this, _superprop_get_g = function() {
                    return swcHelpers.get(swcHelpers.getPrototypeOf(C9.prototype), "g", _this);
                };
                return swcHelpers.wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
                    return regeneratorRuntime.wrap(function _callee$(_ctx) {
                        while(1)switch(_ctx.prev = _ctx.next){
                            case 0:
                                _superprop_get_g().call(_this1);
                            case 1:
                            case "end":
                                return _ctx.stop();
                        }
                    }, _callee);
                }))();
            }
        }
    ]);
    return C9;
}(B9);
