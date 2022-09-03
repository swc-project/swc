//// [typeofThis.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _instanceof from "@swc/helpers/src/_instanceof.mjs";
var Test6, Test7, Test = function Test() {
    "use strict";
    _class_call_check(this, Test), this.data = {};
}, Test1 = function Test1() {
    "use strict";
    _class_call_check(this, Test1), this.data = {
        foo: ""
    }, this.this = "", this.data;
};
function Test2() {}
function Test3() {}
function Test4() {}
var Test5 = function Test5() {
    "use strict";
    _class_call_check(this, Test5), this.no = 1, this.f = function() {};
};
(Test6 || (Test6 = {})).f = function() {}, (Test7 || (Test7 = {})).f = function() {};
var Test8 = function() {}, Test9 = function() {
    "use strict";
    function Test9() {
        _class_call_check(this, Test9), this.no = 0, this.this = 0;
    }
    var _proto = Test9.prototype;
    return _proto.f = function() {
        _instanceof(this, Test9D1) && this.f1(), _instanceof(this, Test9D2) && this.f2();
    }, _proto.g = function() {
        1 === this.no && this.no, 1 === this.this && this.this;
    }, Test9;
}(), Test9D1 = function() {
    "use strict";
    function Test9D1() {
        _class_call_check(this, Test9D1);
    }
    return Test9D1.prototype.f1 = function() {}, Test9D1;
}(), Test9D2 = function() {
    "use strict";
    function Test9D2() {
        _class_call_check(this, Test9D2);
    }
    return Test9D2.prototype.f2 = function() {}, Test9D2;
}(), Test10 = function() {
    "use strict";
    function Test10() {
        _class_call_check(this, Test10);
    }
    return Test10.prototype.foo = function() {
        this.a && this.a.b;
    }, Test10;
}(), Test11 = function() {
    "use strict";
    function Test11() {
        _class_call_check(this, Test11);
    }
    return Test11.prototype.foo = function() {
        this.this && this.this.x && this.this.x;
    }, Test11;
}(), Tests12 = function() {
    "use strict";
    function Tests12() {
        _class_call_check(this, Tests12);
    }
    var _proto = Tests12.prototype;
    return _proto.test1 = function() {}, _proto.test2 = function() {
        for(;;);
    }, _proto.test3 = function() {
        for(var dummy in []);
    }, _proto.test4 = function() {
        for(var _i = 0, _iter = []; _i < _iter.length; _i++)_iter[_i];
    }, Tests12;
}();
