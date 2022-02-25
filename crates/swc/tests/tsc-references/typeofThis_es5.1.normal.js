function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
var _key;
var Test = function Test() {
    "use strict";
    _classCallCheck(this, Test);
    // @noImplicitThis: true
    // @strict: true
    this.data = {};
    var copy = {};
};
var Test1 = function Test1() {
    "use strict";
    _classCallCheck(this, Test1);
    this.data = {
        foo: ''
    };
    this[_key] = '';
    var copy = {
        foo: ''
    };
    var foo = '';
    var self = this;
    self.data;
    var str = '';
};
_key = 'this';
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
    _classCallCheck(this, Test5);
    this.no = 1;
    this.f = function() {
        // should not capture this.
        var x = 1;
    };
};
var Test6;
(function(Test61) {
    var f = Test61.f = function() {
        var x = 1;
    };
})(Test6 || (Test6 = {}));
var Test7;
(function(Test71) {
    var f = Test71.f = function() {
        var x = 1;
    };
})(Test7 || (Test7 = {}));
var Test8 = function() {
    var x = 1;
};
var Test9 = /*#__PURE__*/ function() {
    "use strict";
    function Test9() {
        _classCallCheck(this, Test9);
        this.no = 0;
        this.this = 0;
    }
    _createClass(Test9, [
        {
            key: "f",
            value: function f() {
                if (_instanceof(this, Test9D1)) {
                    var d1 = this;
                    d1.f1();
                }
                if (_instanceof(this, Test9D2)) {
                    var d2 = this;
                    d2.f2();
                }
            }
        },
        {
            key: "g",
            value: function g() {
                if (this.no === 1) {
                    var no = this.no;
                }
                if (this.this === 1) {
                    var no1 = this.this;
                }
            }
        }
    ]);
    return Test9;
}();
var Test9D1 = /*#__PURE__*/ function() {
    "use strict";
    function Test9D1() {
        _classCallCheck(this, Test9D1);
    }
    _createClass(Test9D1, [
        {
            key: "f1",
            value: function f1() {}
        }
    ]);
    return Test9D1;
}();
var Test9D2 = /*#__PURE__*/ function() {
    "use strict";
    function Test9D2() {
        _classCallCheck(this, Test9D2);
    }
    _createClass(Test9D2, [
        {
            key: "f2",
            value: function f2() {}
        }
    ]);
    return Test9D2;
}();
var Test10 = /*#__PURE__*/ function() {
    "use strict";
    function Test10() {
        _classCallCheck(this, Test10);
    }
    _createClass(Test10, [
        {
            key: "foo",
            value: function foo() {
                var a = undefined;
                if (this.a) {
                    var a1 = undefined; // should narrow to { b?: string }
                    var b = undefined;
                    if (this.a.b) {
                        var b1 = undefined; // should narrow to string
                    }
                }
            }
        }
    ]);
    return Test10;
}();
var Test11 = /*#__PURE__*/ function() {
    "use strict";
    function Test11() {
        _classCallCheck(this, Test11);
    }
    _createClass(Test11, [
        {
            key: "foo",
            value: function foo() {
                var o = this;
                var bar = {};
                if (o.this && o.this.x) {
                    var y = o.this.x; // should narrow to string
                }
            }
        }
    ]);
    return Test11;
}();
var Tests12 = /*#__PURE__*/ function() {
    "use strict";
    function Tests12() {
        _classCallCheck(this, Tests12);
    }
    _createClass(Tests12, [
        {
            key: "test1",
            value: function test1() {}
        },
        {
            key: "test2",
            value: function test2() {
                for(;;){}
            }
        },
        {
            key: "test3",
            value: function test3() {
                for(var dummy in []){}
            }
        },
        {
            key: "test4",
            value: function test4() {
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = [][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var dummy = _step.value;
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            }
        }
    ]);
    return Tests12;
}();
