import * as swcHelpers from "@swc/helpers";
var Test6, Test7, Test = function() {
    "use strict";
    swcHelpers.classCallCheck(this, Test), this.data = {};
}, Test1 = function() {
    "use strict";
    swcHelpers.classCallCheck(this, Test1), this.data = {
        foo: ""
    }, this.this = "", this.data;
}, Test5 = function() {
    "use strict";
    swcHelpers.classCallCheck(this, Test5), this.no = 1, this.f = function() {};
};
(Test6 || (Test6 = {})).f = function() {}, (Test7 || (Test7 = {})).f = function() {};
var Test9 = function() {
    "use strict";
    function Test9() {
        swcHelpers.classCallCheck(this, Test9), this.no = 0, this.this = 0;
    }
    return swcHelpers.createClass(Test9, [
        {
            key: "f",
            value: function() {
                if (swcHelpers._instanceof(this, Test9D1)) {
                    var d1 = this;
                    d1.f1();
                }
                if (swcHelpers._instanceof(this, Test9D2)) {
                    var d2 = this;
                    d2.f2();
                }
            }
        },
        {
            key: "g",
            value: function() {
                1 === this.no && this.no, 1 === this.this && this.this;
            }
        }
    ]), Test9;
}(), Test9D1 = function() {
    "use strict";
    function Test9D1() {
        swcHelpers.classCallCheck(this, Test9D1);
    }
    return swcHelpers.createClass(Test9D1, [
        {
            key: "f1",
            value: function() {}
        }
    ]), Test9D1;
}(), Test9D2 = function() {
    "use strict";
    function Test9D2() {
        swcHelpers.classCallCheck(this, Test9D2);
    }
    return swcHelpers.createClass(Test9D2, [
        {
            key: "f2",
            value: function() {}
        }
    ]), Test9D2;
}(), Test10 = function() {
    "use strict";
    function Test10() {
        swcHelpers.classCallCheck(this, Test10);
    }
    return swcHelpers.createClass(Test10, [
        {
            key: "foo",
            value: function() {
                this.a && this.a.b;
            }
        }
    ]), Test10;
}(), Test11 = function() {
    "use strict";
    function Test11() {
        swcHelpers.classCallCheck(this, Test11);
    }
    return swcHelpers.createClass(Test11, [
        {
            key: "foo",
            value: function() {
                this.this && this.this.x && this.this.x;
            }
        }
    ]), Test11;
}(), Tests12 = function() {
    "use strict";
    function Tests12() {
        swcHelpers.classCallCheck(this, Tests12);
    }
    return swcHelpers.createClass(Tests12, [
        {
            key: "test1",
            value: function() {}
        },
        {
            key: "test2",
            value: function() {
                for(;;);
            }
        },
        {
            key: "test3",
            value: function() {
                for(var dummy in []);
            }
        },
        {
            key: "test4",
            value: function() {
                var _iteratorNormalCompletion = !0, _didIteratorError = !1, _iteratorError = void 0;
                try {
                    for(var _step, _iterator = [][Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = !0)_step.value;
                } catch (err) {
                    _didIteratorError = !0, _iteratorError = err;
                } finally{
                    try {
                        _iteratorNormalCompletion || null == _iterator.return || _iterator.return();
                    } finally{
                        if (_didIteratorError) throw _iteratorError;
                    }
                }
            }
        }
    ]), Tests12;
}();
