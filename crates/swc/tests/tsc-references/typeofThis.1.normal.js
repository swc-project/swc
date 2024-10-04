//// [typeofThis.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _instanceof } from "@swc/helpers/_/_instanceof";
var Test = function Test() {
    "use strict";
    _class_call_check(this, Test);
    this.data = {};
    var copy = {};
};
var Test1 = function Test1() {
    "use strict";
    _class_call_check(this, Test1);
    this.data = {
        foo: ''
    };
    this['this'] = '';
    var copy = {
        foo: ''
    };
    var foo = '';
    var self = this;
    self.data;
    var str = '';
};
function Test2() {
    var x = 1;
}
function Test3() {
    var x = 1;
}
function Test4() {
    var x = 1;
}
var Test5 = function Test5() {
    "use strict";
    _class_call_check(this, Test5);
    this.no = 1;
    this.f = function() {
        // should not capture this.
        var x = 1;
    };
};
(function(Test6) {
    Test6.f = function() {
        var x = 1;
    };
})(Test6 || (Test6 = {}));
(function(Test7) {
    Test7.f = function() {
        var x = 1;
    };
})(Test7 || (Test7 = {}));
var Test8 = function() {
    var x = 1;
};
var Test9 = /*#__PURE__*/ function() {
    "use strict";
    function Test9() {
        _class_call_check(this, Test9);
        this.no = 0;
        this.this = 0;
    }
    var _proto = Test9.prototype;
    _proto.f = function f() {
        if (_instanceof(this, Test9D1)) {
            var d1 = this;
            d1.f1();
        }
        if (_instanceof(this, Test9D2)) {
            var d2 = this;
            d2.f2();
        }
    };
    _proto.g = function g() {
        if (this.no === 1) {
            var no = this.no;
        }
        if (this.this === 1) {
            var no1 = this.this;
        }
    };
    return Test9;
}();
var Test9D1 = /*#__PURE__*/ function() {
    "use strict";
    function Test9D1() {
        _class_call_check(this, Test9D1);
    }
    var _proto = Test9D1.prototype;
    _proto.f1 = function f1() {};
    return Test9D1;
}();
var Test9D2 = /*#__PURE__*/ function() {
    "use strict";
    function Test9D2() {
        _class_call_check(this, Test9D2);
    }
    var _proto = Test9D2.prototype;
    _proto.f2 = function f2() {};
    return Test9D2;
}();
var Test10 = /*#__PURE__*/ function() {
    "use strict";
    function Test10() {
        _class_call_check(this, Test10);
    }
    var _proto = Test10.prototype;
    _proto.foo = function foo() {
        var a = undefined;
        if (this.a) {
            var a1 = undefined; // should narrow to { b?: string }
            var b = undefined;
            if (this.a.b) {
                var b1 = undefined; // should narrow to string
            }
        }
    };
    return Test10;
}();
var Test11 = /*#__PURE__*/ function() {
    "use strict";
    function Test11() {
        _class_call_check(this, Test11);
    }
    var _proto = Test11.prototype;
    _proto.foo = function foo() {
        var o = this;
        var bar = {};
        if (o.this && o.this.x) {
            var y = o.this.x; // should narrow to string
        }
    };
    return Test11;
}();
var Tests12 = /*#__PURE__*/ function() {
    "use strict";
    function Tests12() {
        _class_call_check(this, Tests12);
    }
    var _proto = Tests12.prototype;
    _proto.test1 = function test1() {};
    _proto.test2 = function test2() {
        for(;;){}
    };
    _proto.test3 = function test3() {
        for(var dummy in []){}
    };
    _proto.test4 = function test4() {
        for(var _i = 0, _iter = []; _i < _iter.length; _i++){
            var dummy = _iter[_i];
        }
    };
    return Tests12;
}();
var Test6, Test7;
