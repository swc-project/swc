function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    return protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Constructor;
}
function _instanceof(left, right) {
    return null != right && "undefined" != typeof Symbol && right[Symbol.hasInstance] ? !!right[Symbol.hasInstance](left) : left instanceof right;
}
var Test6, Test7, Test = function() {
    "use strict";
    _classCallCheck(this, Test), this.data = {};
}, Test1 = function() {
    "use strict";
    _classCallCheck(this, Test1), this.data = {
        foo: ""
    }, this.this = "", this.data;
}, Test5 = function() {
    "use strict";
    _classCallCheck(this, Test5), this.no = 1, this.f = function() {};
};
(Test6 || (Test6 = {})).f = function() {}, (Test7 || (Test7 = {})).f = function() {};
var Test9 = function() {
    "use strict";
    function Test9() {
        _classCallCheck(this, Test9), this.no = 0, this.this = 0;
    }
    return _createClass(Test9, [
        {
            key: "f",
            value: function() {
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
            value: function() {
                1 === this.no && this.no, 1 === this.this && this.this;
            }
        }
    ]), Test9;
}(), Test9D1 = function() {
    "use strict";
    function Test9D1() {
        _classCallCheck(this, Test9D1);
    }
    return _createClass(Test9D1, [
        {
            key: "f1",
            value: function() {}
        }
    ]), Test9D1;
}(), Test9D2 = function() {
    "use strict";
    function Test9D2() {
        _classCallCheck(this, Test9D2);
    }
    return _createClass(Test9D2, [
        {
            key: "f2",
            value: function() {}
        }
    ]), Test9D2;
}(), Test10 = function() {
    "use strict";
    function Test10() {
        _classCallCheck(this, Test10);
    }
    return _createClass(Test10, [
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
        _classCallCheck(this, Test11);
    }
    return _createClass(Test11, [
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
        _classCallCheck(this, Tests12);
    }
    return _createClass(Tests12, [
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
