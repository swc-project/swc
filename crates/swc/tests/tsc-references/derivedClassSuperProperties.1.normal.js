//// [derivedClassSuperProperties.ts]
import _assert_this_initialized from "@swc/helpers/src/_assert_this_initialized.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _define_enumerable_properties from "@swc/helpers/src/_define_enumerable_properties.mjs";
import _define_property from "@swc/helpers/src/_define_property.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _possible_constructor_return from "@swc/helpers/src/_possible_constructor_return.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
import _ts_decorate from "@swc/helpers/src/_ts_decorate.mjs";
var Base = /*#__PURE__*/ function() {
    "use strict";
    function Base(a) {
        _class_call_check(this, Base);
    }
    var _proto = Base.prototype;
    _proto.receivesAnything = function receivesAnything(param1) {};
    return Base;
}();
var Derived1 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived1, Base);
    var _super = _create_super(Derived1);
    function Derived1() {
        _class_call_check(this, Derived1);
        var _this;
        _get((_assert_this_initialized(_this), _get_prototype_of(Derived1.prototype)), "receivesAnything", _this).call(_this);
        _this = _super.call(this);
        _this.prop = true;
        return _possible_constructor_return(_this);
    }
    return Derived1;
}(Base);
var Derived2 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived2, Base);
    var _super = _create_super(Derived2);
    function Derived2() {
        _class_call_check(this, Derived2);
        var _this;
        _get((_assert_this_initialized(_this), _get_prototype_of(Derived2.prototype)), "receivesAnything", _this).call(_this, _assert_this_initialized(_this));
        _this = _super.call(this);
        _this.prop = true;
        return _possible_constructor_return(_this);
    }
    return Derived2;
}(Base);
var Derived3 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived3, Base);
    var _super = _create_super(Derived3);
    function Derived3() {
        _class_call_check(this, Derived3);
        var _this;
        _get((_assert_this_initialized(_this), _get_prototype_of(Derived3.prototype)), "receivesAnything", _this).call(_this);
        _this = _super.call(this, _assert_this_initialized(_this));
        _this.prop = true;
        return _possible_constructor_return(_this);
    }
    return Derived3;
}(Base);
var Derived4 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived4, Base);
    var _super = _create_super(Derived4);
    function Derived4() {
        _class_call_check(this, Derived4);
        var _this;
        _get((_assert_this_initialized(_this), _get_prototype_of(Derived4.prototype)), "receivesAnything", _this).call(_this, _assert_this_initialized(_this));
        _this = _super.call(this, _assert_this_initialized(_this));
        _this.prop = true;
        return _possible_constructor_return(_this);
    }
    return Derived4;
}(Base);
var Derived5 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived5, Base);
    var _super = _create_super(Derived5);
    function Derived5() {
        _class_call_check(this, Derived5);
        var _this;
        _this = _super.call(this);
        _this.prop = true;
        _get((_assert_this_initialized(_this), _get_prototype_of(Derived5.prototype)), "receivesAnything", _this).call(_this);
        return _this;
    }
    return Derived5;
}(Base);
var Derived6 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived6, Base);
    var _super = _create_super(Derived6);
    function Derived6() {
        _class_call_check(this, Derived6);
        var _this;
        _this = _super.call(this, _assert_this_initialized(_this));
        _this.prop = true;
        _get((_assert_this_initialized(_this), _get_prototype_of(Derived6.prototype)), "receivesAnything", _this).call(_this);
        return _this;
    }
    return Derived6;
}(Base);
var Derived7 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived7, Base);
    var _super = _create_super(Derived7);
    function Derived7() {
        _class_call_check(this, Derived7);
        var _this;
        _this = _super.call(this);
        _this.prop = true;
        _get((_assert_this_initialized(_this), _get_prototype_of(Derived7.prototype)), "receivesAnything", _this).call(_this, _assert_this_initialized(_this));
        return _this;
    }
    return Derived7;
}(Base);
var Derived8 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived8, Base);
    var _super = _create_super(Derived8);
    function Derived8() {
        _class_call_check(this, Derived8);
        var _this;
        _this = _super.call(this, _assert_this_initialized(_this));
        _this.prop = true;
        _get((_assert_this_initialized(_this), _get_prototype_of(Derived8.prototype)), "receivesAnything", _this).call(_this, _assert_this_initialized(_this));
        return _this;
    }
    return Derived8;
}(Base);
var DerivedWithArrowFunction = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(DerivedWithArrowFunction, Base);
    var _super = _create_super(DerivedWithArrowFunction);
    function DerivedWithArrowFunction() {
        _class_call_check(this, DerivedWithArrowFunction);
        var _this;
        (function() {
            return _assert_this_initialized(_this);
        })();
        _this = _super.call(this);
        _this.prop = true;
        return _this;
    }
    return DerivedWithArrowFunction;
}(Base);
var DerivedWithArrowFunctionParameter = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(DerivedWithArrowFunctionParameter, Base);
    var _super = _create_super(DerivedWithArrowFunctionParameter);
    function DerivedWithArrowFunctionParameter() {
        _class_call_check(this, DerivedWithArrowFunctionParameter);
        var _this;
        var lambda = function() {
            var param1 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : _assert_this_initialized(_this);
        };
        _this = _super.call(this);
        _this.prop = true;
        return _this;
    }
    return DerivedWithArrowFunctionParameter;
}(Base);
var DerivedWithDecoratorOnClass = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(DerivedWithDecoratorOnClass, Base);
    var _super = _create_super(DerivedWithDecoratorOnClass);
    function DerivedWithDecoratorOnClass() {
        _class_call_check(this, DerivedWithDecoratorOnClass);
        var _this;
        var InnerClass = function InnerClass() {
            _class_call_check(this, InnerClass);
        };
        InnerClass = _ts_decorate([
            decorate(_assert_this_initialized(_this))
        ], InnerClass);
        _this = _super.call(this);
        _this.prop = true;
        return _this;
    }
    return DerivedWithDecoratorOnClass;
}(Base);
var DerivedWithDecoratorOnClassMethod = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(DerivedWithDecoratorOnClassMethod, Base);
    var _super = _create_super(DerivedWithDecoratorOnClassMethod);
    function DerivedWithDecoratorOnClassMethod() {
        _class_call_check(this, DerivedWithDecoratorOnClassMethod);
        var _this;
        var InnerClass = /*#__PURE__*/ function() {
            function InnerClass() {
                _class_call_check(this, InnerClass);
            }
            var _proto = InnerClass.prototype;
            _proto.innerMethod = function innerMethod() {};
            return InnerClass;
        }();
        _ts_decorate([
            decorate(_assert_this_initialized(_this))
        ], InnerClass.prototype, "innerMethod", null);
        _this = _super.call(this);
        _this.prop = true;
        return _this;
    }
    return DerivedWithDecoratorOnClassMethod;
}(Base);
var DerivedWithDecoratorOnClassProperty = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(DerivedWithDecoratorOnClassProperty, Base);
    var _super = _create_super(DerivedWithDecoratorOnClassProperty);
    function DerivedWithDecoratorOnClassProperty() {
        _class_call_check(this, DerivedWithDecoratorOnClassProperty);
        var _this;
        var InnerClass = function InnerClass() {
            _class_call_check(this, InnerClass);
            this.innerProp = true;
        };
        _ts_decorate([
            decorate(_assert_this_initialized(_this))
        ], InnerClass.prototype, "innerProp", void 0);
        _this = _super.call(this);
        _this.prop = true;
        return _this;
    }
    return DerivedWithDecoratorOnClassProperty;
}(Base);
var DerivedWithFunctionDeclaration = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(DerivedWithFunctionDeclaration, Base);
    var _super = _create_super(DerivedWithFunctionDeclaration);
    function DerivedWithFunctionDeclaration() {
        _class_call_check(this, DerivedWithFunctionDeclaration);
        var _this;
        var declaration = function declaration() {
            return this;
        };
        _this = _super.call(this);
        _this.prop = true;
        return _this;
    }
    return DerivedWithFunctionDeclaration;
}(Base);
var DerivedWithFunctionDeclarationAndThisParam = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(DerivedWithFunctionDeclarationAndThisParam, Base);
    var _super = _create_super(DerivedWithFunctionDeclarationAndThisParam);
    function DerivedWithFunctionDeclarationAndThisParam() {
        _class_call_check(this, DerivedWithFunctionDeclarationAndThisParam);
        var _this;
        var declaration = function declaration() {
            var param1 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this;
            return param1;
        };
        _this = _super.call(this);
        _this.prop = true;
        return _this;
    }
    return DerivedWithFunctionDeclarationAndThisParam;
}(Base);
var DerivedWithFunctionExpression = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(DerivedWithFunctionExpression, Base);
    var _super = _create_super(DerivedWithFunctionExpression);
    function DerivedWithFunctionExpression() {
        _class_call_check(this, DerivedWithFunctionExpression);
        var _this;
        (function() {
            return this;
        })();
        _this = _super.call(this);
        _this.prop = true;
        return _this;
    }
    return DerivedWithFunctionExpression;
}(Base);
var DerivedWithParenthesis = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(DerivedWithParenthesis, Base);
    var _super = _create_super(DerivedWithParenthesis);
    function DerivedWithParenthesis() {
        _class_call_check(this, DerivedWithParenthesis);
        var _this;
        var _temp;
        _temp = _this = _super.call(this), _this.prop = true, _temp;
        return _possible_constructor_return(_this);
    }
    return DerivedWithParenthesis;
}(Base);
var DerivedWithParenthesisAfterStatement = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(DerivedWithParenthesisAfterStatement, Base);
    var _super = _create_super(DerivedWithParenthesisAfterStatement);
    function DerivedWithParenthesisAfterStatement() {
        _class_call_check(this, DerivedWithParenthesisAfterStatement);
        var _this;
        _this.prop;
        var _temp;
        _temp = _this = _super.call(this), _this.prop = true, _temp;
        return _possible_constructor_return(_this);
    }
    return DerivedWithParenthesisAfterStatement;
}(Base);
var DerivedWithParenthesisBeforeStatement = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(DerivedWithParenthesisBeforeStatement, Base);
    var _super = _create_super(DerivedWithParenthesisBeforeStatement);
    function DerivedWithParenthesisBeforeStatement() {
        _class_call_check(this, DerivedWithParenthesisBeforeStatement);
        var _this;
        var _temp;
        _temp = _this = _super.call(this), _this.prop = true, _temp;
        _this.prop;
        return _possible_constructor_return(_this);
    }
    return DerivedWithParenthesisBeforeStatement;
}(Base);
var DerivedWithClassDeclaration = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(DerivedWithClassDeclaration, Base);
    var _super = _create_super(DerivedWithClassDeclaration);
    function DerivedWithClassDeclaration() {
        _class_call_check(this, DerivedWithClassDeclaration);
        var _this;
        var InnerClass = /*#__PURE__*/ function() {
            function InnerClass() {
                _class_call_check(this, InnerClass);
                this.property = 7;
                this.property;
                this.method();
            }
            var _proto = InnerClass.prototype;
            _proto.method = function method() {
                return this;
            };
            return InnerClass;
        }();
        _this = _super.call(this);
        _this.prop = true;
        return _this;
    }
    return DerivedWithClassDeclaration;
}(Base);
var DerivedWithClassDeclarationExtendingMember = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(DerivedWithClassDeclarationExtendingMember, Base);
    var _super = _create_super(DerivedWithClassDeclarationExtendingMember);
    function DerivedWithClassDeclarationExtendingMember() {
        _class_call_check(this, DerivedWithClassDeclarationExtendingMember);
        var _this;
        var InnerClass = /*#__PURE__*/ function(_memberClass) {
            _inherits(InnerClass, _memberClass);
            var _super = _create_super(InnerClass);
            function InnerClass() {
                _class_call_check(this, InnerClass);
                var _this;
                _this = _super.call(this);
                _this.property = 7;
                _this.property;
                _this.method();
                return _this;
            }
            var _proto = InnerClass.prototype;
            _proto.method = function method() {
                return this;
            };
            return InnerClass;
        }(_this.memberClass);
        _this = _super.call(this);
        _this.memberClass = function _class() {
            _class_call_check(this, _class);
        };
        return _possible_constructor_return(_this);
    }
    return DerivedWithClassDeclarationExtendingMember;
}(Base);
var DerivedWithClassExpression = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(DerivedWithClassExpression, Base);
    var _super = _create_super(DerivedWithClassExpression);
    function DerivedWithClassExpression() {
        _class_call_check(this, DerivedWithClassExpression);
        var _this;
        console.log(/*#__PURE__*/ function() {
            function _class() {
                _class_call_check(this, _class);
                this.property = 7;
                this.property;
                this.method();
            }
            var _proto = _class.prototype;
            _proto.method = function method() {
                return this;
            };
            return _class;
        }());
        _this = _super.call(this);
        _this.prop = true;
        return _this;
    }
    return DerivedWithClassExpression;
}(Base);
var DerivedWithClassExpressionExtendingMember = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(DerivedWithClassExpressionExtendingMember, Base);
    var _super = _create_super(DerivedWithClassExpressionExtendingMember);
    function DerivedWithClassExpressionExtendingMember() {
        _class_call_check(this, DerivedWithClassExpressionExtendingMember);
        var _this;
        console.log(/*#__PURE__*/ function(_memberClass) {
            _inherits(_class, _memberClass);
            var _super = _create_super(_class);
            function _class() {
                _class_call_check(this, _class);
                return _super.apply(this, arguments);
            }
            return _class;
        }(_this.memberClass));
        _this = _super.call(this);
        _this.memberClass = function _class() {
            _class_call_check(this, _class);
        };
        return _this;
    }
    return DerivedWithClassExpressionExtendingMember;
}(Base);
var DerivedWithDerivedClassExpression = /*#__PURE__*/ function(Base1) {
    "use strict";
    _inherits(DerivedWithDerivedClassExpression, Base1);
    var _super = _create_super(DerivedWithDerivedClassExpression);
    function DerivedWithDerivedClassExpression() {
        _class_call_check(this, DerivedWithDerivedClassExpression);
        var _this;
        console.log(/*#__PURE__*/ function(Base) {
            _inherits(_class, Base);
            var _super = _create_super(_class);
            function _class() {
                _class_call_check(this, _class);
                var _this;
                _this = _super.call(this);
                _this.bar = function() {
                    return _assert_this_initialized(_this);
                };
                return _this;
            }
            var _proto = _class.prototype;
            _proto.foo = function foo() {
                return this;
            };
            return _class;
        }(Base));
        _this = _super.call(this);
        _this.prop = true;
        return _possible_constructor_return(_this);
    }
    return DerivedWithDerivedClassExpression;
}(Base);
var DerivedWithNewDerivedClassExpression = /*#__PURE__*/ function(Base1) {
    "use strict";
    _inherits(DerivedWithNewDerivedClassExpression, Base1);
    var _super = _create_super(DerivedWithNewDerivedClassExpression);
    function DerivedWithNewDerivedClassExpression() {
        _class_call_check(this, DerivedWithNewDerivedClassExpression);
        var _this;
        console.log(new /*#__PURE__*/ (function(Base) {
            _inherits(_class, Base);
            var _super = _create_super(_class);
            function _class() {
                _class_call_check(this, _class);
                return _super.call(this);
            }
            return _class;
        }(Base))());
        _this = _super.call(this);
        _this.prop = true;
        return _possible_constructor_return(_this);
    }
    return DerivedWithNewDerivedClassExpression;
}(Base);
var DerivedWithObjectAccessors = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(DerivedWithObjectAccessors, Base);
    var _super = _create_super(DerivedWithObjectAccessors);
    function DerivedWithObjectAccessors() {
        _class_call_check(this, DerivedWithObjectAccessors);
        var _this;
        var obj = {
            get prop () {
                return _possible_constructor_return(_this, true);
            },
            set prop (param){
                _this._prop = param;
            }
        };
        _this = _super.call(this);
        _this.prop = true;
        return _this;
    }
    return DerivedWithObjectAccessors;
}(Base);
var DerivedWithObjectAccessorsUsingThisInKeys = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(DerivedWithObjectAccessorsUsingThisInKeys, Base);
    var _super = _create_super(DerivedWithObjectAccessorsUsingThisInKeys);
    function DerivedWithObjectAccessorsUsingThisInKeys() {
        _class_call_check(this, DerivedWithObjectAccessorsUsingThisInKeys);
        var _this;
        var _obj, _mutatorMap = {};
        var obj = (_obj = {
            _prop: "prop"
        }, _mutatorMap[_this.propName] = _mutatorMap[_this.propName] || {}, _mutatorMap[_this.propName].get = function() {
            return _possible_constructor_return(_this, true);
        }, _mutatorMap[_this.propName] = _mutatorMap[_this.propName] || {}, _mutatorMap[_this.propName].set = function(param1) {
            _this._prop = param1;
        }, _define_enumerable_properties(_obj, _mutatorMap), _obj);
        _this = _super.call(this);
        _this.propName = "prop";
        return _this;
    }
    return DerivedWithObjectAccessorsUsingThisInKeys;
}(Base);
var DerivedWithObjectAccessorsUsingThisInBodies = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(DerivedWithObjectAccessorsUsingThisInBodies, Base);
    var _super = _create_super(DerivedWithObjectAccessorsUsingThisInBodies);
    function DerivedWithObjectAccessorsUsingThisInBodies() {
        _class_call_check(this, DerivedWithObjectAccessorsUsingThisInBodies);
        var _this;
        var obj = {
            _prop: "prop",
            get prop () {
                return _possible_constructor_return(_this, _this._prop);
            },
            set prop (param){
                _this._prop = param;
            }
        };
        _this = _super.call(this);
        _this.propName = "prop";
        return _this;
    }
    return DerivedWithObjectAccessorsUsingThisInBodies;
}(Base);
var DerivedWithObjectComputedPropertyBody = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(DerivedWithObjectComputedPropertyBody, Base);
    var _super = _create_super(DerivedWithObjectComputedPropertyBody);
    function DerivedWithObjectComputedPropertyBody() {
        _class_call_check(this, DerivedWithObjectComputedPropertyBody);
        var _this;
        var obj = {
            prop: _this.propName
        };
        _this = _super.call(this);
        _this.propName = "prop";
        return _this;
    }
    return DerivedWithObjectComputedPropertyBody;
}(Base);
var DerivedWithObjectComputedPropertyName = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(DerivedWithObjectComputedPropertyName, Base);
    var _super = _create_super(DerivedWithObjectComputedPropertyName);
    function DerivedWithObjectComputedPropertyName() {
        _class_call_check(this, DerivedWithObjectComputedPropertyName);
        var _this;
        var obj = _define_property({}, _this.propName, true);
        _this = _super.call(this);
        _this.propName = "prop";
        return _this;
    }
    return DerivedWithObjectComputedPropertyName;
}(Base);
var DerivedWithObjectMethod = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(DerivedWithObjectMethod, Base);
    var _super = _create_super(DerivedWithObjectMethod);
    function DerivedWithObjectMethod() {
        _class_call_check(this, DerivedWithObjectMethod);
        var _this;
        var obj = {
            getProp: function getProp() {
                return this;
            }
        };
        _this = _super.call(this);
        _this.prop = true;
        return _this;
    }
    return DerivedWithObjectMethod;
}(Base);
var a, b;
var DerivedWithLoops = [
    /*#__PURE__*/ function(Base) {
        "use strict";
        _inherits(_class, Base);
        var _super = _create_super(_class);
        function _class() {
            _class_call_check(this, _class);
            var _this;
            var _temp;
            for(_temp = _this = _super.call(this), _this.prop = true, _temp;;){}
            return _possible_constructor_return(_this);
        }
        return _class;
    }(Base),
    /*#__PURE__*/ function(Base) {
        "use strict";
        _inherits(_class, Base);
        var _super = _create_super(_class);
        function _class() {
            _class_call_check(this, _class);
            var _this;
            var _temp;
            for(a; _temp = _this = _super.call(this), _this.prop = true, _temp;){}
            return _possible_constructor_return(_this);
        }
        return _class;
    }(Base),
    /*#__PURE__*/ function(Base) {
        "use strict";
        _inherits(_class, Base);
        var _super = _create_super(_class);
        function _class() {
            _class_call_check(this, _class);
            var _this;
            var _temp;
            for(a; b; _temp = _this = _super.call(this), _this.prop = true, _temp){}
            return _possible_constructor_return(_this);
        }
        return _class;
    }(Base),
    /*#__PURE__*/ function(Base) {
        "use strict";
        _inherits(_class, Base);
        var _super = _create_super(_class);
        function _class() {
            _class_call_check(this, _class);
            var _this;
            var _temp;
            for(;; _temp = _this = _super.call(this), _this.prop = true, _temp){
                break;
            }
            return _possible_constructor_return(_this);
        }
        return _class;
    }(Base),
    /*#__PURE__*/ function(Base) {
        "use strict";
        _inherits(_class, Base);
        var _super = _create_super(_class);
        function _class() {
            _class_call_check(this, _class);
            var _this;
            var _temp;
            var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
            try {
                for(var _iterator = (_temp = _this = _super.call(this), _this.prop = true, _temp)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                    var x = _step.value;
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
            return _possible_constructor_return(_this);
        }
        return _class;
    }(Base),
    /*#__PURE__*/ function(Base) {
        "use strict";
        _inherits(_class, Base);
        var _super = _create_super(_class);
        function _class() {
            _class_call_check(this, _class);
            var _this;
            var _temp;
            while(_temp = _this = _super.call(this), _this.prop = true, _temp){}
            return _possible_constructor_return(_this);
        }
        return _class;
    }(Base),
    /*#__PURE__*/ function(Base) {
        "use strict";
        _inherits(_class, Base);
        var _super = _create_super(_class);
        function _class() {
            _class_call_check(this, _class);
            var _this;
            var _temp;
            do {}while (_temp = _this = _super.call(this), _this.prop = true, _temp);
            return _possible_constructor_return(_this);
        }
        return _class;
    }(Base),
    /*#__PURE__*/ function(Base) {
        "use strict";
        _inherits(_class, Base);
        var _super = _create_super(_class);
        function _class() {
            _class_call_check(this, _class);
            var _this;
            var _temp;
            if (_temp = _this = _super.call(this), _this.prop = true, _temp) {}
            return _possible_constructor_return(_this);
        }
        return _class;
    }(Base),
    /*#__PURE__*/ function(Base) {
        "use strict";
        _inherits(_class, Base);
        var _super = _create_super(_class);
        function _class() {
            _class_call_check(this, _class);
            var _this;
            var _temp;
            switch(_temp = _this = _super.call(this), _this.prop = true, _temp){
            }
            return _possible_constructor_return(_this);
        }
        return _class;
    }(Base), 
];
