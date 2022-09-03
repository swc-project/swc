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
var a, b, Base = function() {
    "use strict";
    function Base(a) {
        _class_call_check(this, Base);
    }
    return Base.prototype.receivesAnything = function(param) {}, Base;
}(), Derived1 = function(Base) {
    "use strict";
    _inherits(Derived1, Base);
    var _super = _create_super(Derived1);
    function Derived1() {
        var _this;
        return _class_call_check(this, Derived1), _get((_assert_this_initialized(_this), _get_prototype_of(Derived1.prototype)), "receivesAnything", _this).call(_this), (_this = _super.call(this)).prop = !0, _possible_constructor_return(_this);
    }
    return Derived1;
}(Base), Derived2 = function(Base) {
    "use strict";
    _inherits(Derived2, Base);
    var _super = _create_super(Derived2);
    function Derived2() {
        var _this;
        return _class_call_check(this, Derived2), _get((_assert_this_initialized(_this), _get_prototype_of(Derived2.prototype)), "receivesAnything", _this).call(_this, _assert_this_initialized(_this)), (_this = _super.call(this)).prop = !0, _possible_constructor_return(_this);
    }
    return Derived2;
}(Base), Derived3 = function(Base) {
    "use strict";
    _inherits(Derived3, Base);
    var _super = _create_super(Derived3);
    function Derived3() {
        var _this;
        return _class_call_check(this, Derived3), _get((_assert_this_initialized(_this), _get_prototype_of(Derived3.prototype)), "receivesAnything", _this).call(_this), (_this = _super.call(this, _assert_this_initialized(_this))).prop = !0, _possible_constructor_return(_this);
    }
    return Derived3;
}(Base), Derived4 = function(Base) {
    "use strict";
    _inherits(Derived4, Base);
    var _super = _create_super(Derived4);
    function Derived4() {
        var _this;
        return _class_call_check(this, Derived4), _get((_assert_this_initialized(_this), _get_prototype_of(Derived4.prototype)), "receivesAnything", _this).call(_this, _assert_this_initialized(_this)), (_this = _super.call(this, _assert_this_initialized(_this))).prop = !0, _possible_constructor_return(_this);
    }
    return Derived4;
}(Base), Derived5 = function(Base) {
    "use strict";
    _inherits(Derived5, Base);
    var _super = _create_super(Derived5);
    function Derived5() {
        var _this;
        return _class_call_check(this, Derived5), (_this = _super.call(this)).prop = !0, _get((_assert_this_initialized(_this), _get_prototype_of(Derived5.prototype)), "receivesAnything", _this).call(_this), _this;
    }
    return Derived5;
}(Base), Derived6 = function(Base) {
    "use strict";
    _inherits(Derived6, Base);
    var _super = _create_super(Derived6);
    function Derived6() {
        var _this;
        return _class_call_check(this, Derived6), (_this = _super.call(this, _assert_this_initialized(_this))).prop = !0, _get((_assert_this_initialized(_this), _get_prototype_of(Derived6.prototype)), "receivesAnything", _this).call(_this), _this;
    }
    return Derived6;
}(Base), Derived7 = function(Base) {
    "use strict";
    _inherits(Derived7, Base);
    var _super = _create_super(Derived7);
    function Derived7() {
        var _this;
        return _class_call_check(this, Derived7), (_this = _super.call(this)).prop = !0, _get((_assert_this_initialized(_this), _get_prototype_of(Derived7.prototype)), "receivesAnything", _this).call(_this, _assert_this_initialized(_this)), _this;
    }
    return Derived7;
}(Base), Derived8 = function(Base) {
    "use strict";
    _inherits(Derived8, Base);
    var _super = _create_super(Derived8);
    function Derived8() {
        var _this;
        return _class_call_check(this, Derived8), (_this = _super.call(this, _assert_this_initialized(_this))).prop = !0, _get((_assert_this_initialized(_this), _get_prototype_of(Derived8.prototype)), "receivesAnything", _this).call(_this, _assert_this_initialized(_this)), _this;
    }
    return Derived8;
}(Base), DerivedWithArrowFunction = function(Base) {
    "use strict";
    _inherits(DerivedWithArrowFunction, Base);
    var _super = _create_super(DerivedWithArrowFunction);
    function DerivedWithArrowFunction() {
        var _this;
        return _class_call_check(this, DerivedWithArrowFunction), _assert_this_initialized(_this), (_this = _super.call(this)).prop = !0, _this;
    }
    return DerivedWithArrowFunction;
}(Base), DerivedWithArrowFunctionParameter = function(Base) {
    "use strict";
    _inherits(DerivedWithArrowFunctionParameter, Base);
    var _super = _create_super(DerivedWithArrowFunctionParameter);
    function DerivedWithArrowFunctionParameter() {
        var _this;
        return _class_call_check(this, DerivedWithArrowFunctionParameter), (_this = _super.call(this)).prop = !0, _this;
    }
    return DerivedWithArrowFunctionParameter;
}(Base), DerivedWithDecoratorOnClass = function(Base) {
    "use strict";
    _inherits(DerivedWithDecoratorOnClass, Base);
    var _super = _create_super(DerivedWithDecoratorOnClass);
    function DerivedWithDecoratorOnClass() {
        _class_call_check(this, DerivedWithDecoratorOnClass);
        var _this, InnerClass = function InnerClass() {
            _class_call_check(this, InnerClass);
        };
        return InnerClass = _ts_decorate([
            decorate(_assert_this_initialized(_this))
        ], InnerClass), (_this = _super.call(this)).prop = !0, _this;
    }
    return DerivedWithDecoratorOnClass;
}(Base), DerivedWithDecoratorOnClassMethod = function(Base) {
    "use strict";
    _inherits(DerivedWithDecoratorOnClassMethod, Base);
    var _super = _create_super(DerivedWithDecoratorOnClassMethod);
    function DerivedWithDecoratorOnClassMethod() {
        _class_call_check(this, DerivedWithDecoratorOnClassMethod);
        var _this, InnerClass = function() {
            function InnerClass() {
                _class_call_check(this, InnerClass);
            }
            return InnerClass.prototype.innerMethod = function() {}, InnerClass;
        }();
        return _ts_decorate([
            decorate(_assert_this_initialized(_this))
        ], InnerClass.prototype, "innerMethod", null), (_this = _super.call(this)).prop = !0, _this;
    }
    return DerivedWithDecoratorOnClassMethod;
}(Base), DerivedWithDecoratorOnClassProperty = function(Base) {
    "use strict";
    _inherits(DerivedWithDecoratorOnClassProperty, Base);
    var _super = _create_super(DerivedWithDecoratorOnClassProperty);
    function DerivedWithDecoratorOnClassProperty() {
        _class_call_check(this, DerivedWithDecoratorOnClassProperty);
        var _this, InnerClass = function InnerClass() {
            _class_call_check(this, InnerClass), this.innerProp = !0;
        };
        return _ts_decorate([
            decorate(_assert_this_initialized(_this))
        ], InnerClass.prototype, "innerProp", void 0), (_this = _super.call(this)).prop = !0, _this;
    }
    return DerivedWithDecoratorOnClassProperty;
}(Base), DerivedWithFunctionDeclaration = function(Base) {
    "use strict";
    _inherits(DerivedWithFunctionDeclaration, Base);
    var _super = _create_super(DerivedWithFunctionDeclaration);
    function DerivedWithFunctionDeclaration() {
        var _this;
        return _class_call_check(this, DerivedWithFunctionDeclaration), (_this = _super.call(this)).prop = !0, _this;
    }
    return DerivedWithFunctionDeclaration;
}(Base), DerivedWithFunctionDeclarationAndThisParam = function(Base) {
    "use strict";
    _inherits(DerivedWithFunctionDeclarationAndThisParam, Base);
    var _super = _create_super(DerivedWithFunctionDeclarationAndThisParam);
    function DerivedWithFunctionDeclarationAndThisParam() {
        var _this;
        return _class_call_check(this, DerivedWithFunctionDeclarationAndThisParam), (_this = _super.call(this)).prop = !0, _this;
    }
    return DerivedWithFunctionDeclarationAndThisParam;
}(Base), DerivedWithFunctionExpression = function(Base) {
    "use strict";
    _inherits(DerivedWithFunctionExpression, Base);
    var _super = _create_super(DerivedWithFunctionExpression);
    function DerivedWithFunctionExpression() {
        var _this;
        return _class_call_check(this, DerivedWithFunctionExpression), (_this = _super.call(this)).prop = !0, _this;
    }
    return DerivedWithFunctionExpression;
}(Base), DerivedWithParenthesis = function(Base) {
    "use strict";
    _inherits(DerivedWithParenthesis, Base);
    var _super = _create_super(DerivedWithParenthesis);
    function DerivedWithParenthesis() {
        var _this;
        return _class_call_check(this, DerivedWithParenthesis), (_this = _super.call(this)).prop = !0, _possible_constructor_return(_this);
    }
    return DerivedWithParenthesis;
}(Base), DerivedWithParenthesisAfterStatement = function(Base) {
    "use strict";
    _inherits(DerivedWithParenthesisAfterStatement, Base);
    var _super = _create_super(DerivedWithParenthesisAfterStatement);
    function DerivedWithParenthesisAfterStatement() {
        var _this;
        return _class_call_check(this, DerivedWithParenthesisAfterStatement), _this.prop, (_this = _super.call(this)).prop = !0, _possible_constructor_return(_this);
    }
    return DerivedWithParenthesisAfterStatement;
}(Base), DerivedWithParenthesisBeforeStatement = function(Base) {
    "use strict";
    _inherits(DerivedWithParenthesisBeforeStatement, Base);
    var _super = _create_super(DerivedWithParenthesisBeforeStatement);
    function DerivedWithParenthesisBeforeStatement() {
        var _this;
        return _class_call_check(this, DerivedWithParenthesisBeforeStatement), (_this = _super.call(this)).prop = !0, _this.prop, _possible_constructor_return(_this);
    }
    return DerivedWithParenthesisBeforeStatement;
}(Base), DerivedWithClassDeclaration = function(Base) {
    "use strict";
    _inherits(DerivedWithClassDeclaration, Base);
    var _super = _create_super(DerivedWithClassDeclaration);
    function DerivedWithClassDeclaration() {
        var _this;
        return _class_call_check(this, DerivedWithClassDeclaration), (_this = _super.call(this)).prop = !0, _this;
    }
    return DerivedWithClassDeclaration;
}(Base), DerivedWithClassDeclarationExtendingMember = function(Base) {
    "use strict";
    _inherits(DerivedWithClassDeclarationExtendingMember, Base);
    var _super = _create_super(DerivedWithClassDeclarationExtendingMember);
    function DerivedWithClassDeclarationExtendingMember() {
        var _this;
        return _class_call_check(this, DerivedWithClassDeclarationExtendingMember), _this.memberClass, (_this = _super.call(this)).memberClass = function _class() {
            _class_call_check(this, _class);
        }, _possible_constructor_return(_this);
    }
    return DerivedWithClassDeclarationExtendingMember;
}(Base), DerivedWithClassExpression = function(Base) {
    "use strict";
    _inherits(DerivedWithClassExpression, Base);
    var _super = _create_super(DerivedWithClassExpression);
    function DerivedWithClassExpression() {
        var _this;
        return _class_call_check(this, DerivedWithClassExpression), console.log(function() {
            function _class() {
                _class_call_check(this, _class), this.property = 7, this.property, this.method();
            }
            return _class.prototype.method = function() {
                return this;
            }, _class;
        }()), (_this = _super.call(this)).prop = !0, _this;
    }
    return DerivedWithClassExpression;
}(Base), DerivedWithClassExpressionExtendingMember = function(Base) {
    "use strict";
    _inherits(DerivedWithClassExpressionExtendingMember, Base);
    var _super = _create_super(DerivedWithClassExpressionExtendingMember);
    function DerivedWithClassExpressionExtendingMember() {
        var _this;
        return _class_call_check(this, DerivedWithClassExpressionExtendingMember), console.log(function(_memberClass) {
            _inherits(_class, _memberClass);
            var _super = _create_super(_class);
            function _class() {
                return _class_call_check(this, _class), _super.apply(this, arguments);
            }
            return _class;
        }(_this.memberClass)), (_this = _super.call(this)).memberClass = function _class() {
            _class_call_check(this, _class);
        }, _this;
    }
    return DerivedWithClassExpressionExtendingMember;
}(Base), DerivedWithDerivedClassExpression = function(Base1) {
    "use strict";
    _inherits(DerivedWithDerivedClassExpression, Base1);
    var _super = _create_super(DerivedWithDerivedClassExpression);
    function DerivedWithDerivedClassExpression() {
        var _this;
        return _class_call_check(this, DerivedWithDerivedClassExpression), console.log(function(Base) {
            _inherits(_class, Base);
            var _super = _create_super(_class);
            function _class() {
                var _this;
                return _class_call_check(this, _class), (_this = _super.call(this)).bar = function() {
                    return _assert_this_initialized(_this);
                }, _this;
            }
            return _class.prototype.foo = function() {
                return this;
            }, _class;
        }(Base)), (_this = _super.call(this)).prop = !0, _possible_constructor_return(_this);
    }
    return DerivedWithDerivedClassExpression;
}(Base), DerivedWithNewDerivedClassExpression = function(Base1) {
    "use strict";
    _inherits(DerivedWithNewDerivedClassExpression, Base1);
    var _super = _create_super(DerivedWithNewDerivedClassExpression);
    function DerivedWithNewDerivedClassExpression() {
        var _this;
        return _class_call_check(this, DerivedWithNewDerivedClassExpression), console.log(new (function(Base) {
            _inherits(_class, Base);
            var _super = _create_super(_class);
            function _class() {
                return _class_call_check(this, _class), _super.call(this);
            }
            return _class;
        }(Base))()), (_this = _super.call(this)).prop = !0, _possible_constructor_return(_this);
    }
    return DerivedWithNewDerivedClassExpression;
}(Base), DerivedWithObjectAccessors = function(Base) {
    "use strict";
    _inherits(DerivedWithObjectAccessors, Base);
    var _super = _create_super(DerivedWithObjectAccessors);
    function DerivedWithObjectAccessors() {
        var _this;
        return _class_call_check(this, DerivedWithObjectAccessors), (_this = _super.call(this)).prop = !0, _this;
    }
    return DerivedWithObjectAccessors;
}(Base), DerivedWithObjectAccessorsUsingThisInKeys = function(Base) {
    "use strict";
    _inherits(DerivedWithObjectAccessorsUsingThisInKeys, Base);
    var _super = _create_super(DerivedWithObjectAccessorsUsingThisInKeys);
    function DerivedWithObjectAccessorsUsingThisInKeys() {
        _class_call_check(this, DerivedWithObjectAccessorsUsingThisInKeys);
        var _this, _obj, _mutatorMap = {};
        return _obj = {
            _prop: "prop"
        }, _mutatorMap[_this.propName] = _mutatorMap[_this.propName] || {}, _mutatorMap[_this.propName].get = function() {
            return _possible_constructor_return(_this, !0);
        }, _mutatorMap[_this.propName] = _mutatorMap[_this.propName] || {}, _mutatorMap[_this.propName].set = function(param) {
            _this._prop = param;
        }, _define_enumerable_properties(_obj, _mutatorMap), (_this = _super.call(this)).propName = "prop", _this;
    }
    return DerivedWithObjectAccessorsUsingThisInKeys;
}(Base), DerivedWithObjectAccessorsUsingThisInBodies = function(Base) {
    "use strict";
    _inherits(DerivedWithObjectAccessorsUsingThisInBodies, Base);
    var _super = _create_super(DerivedWithObjectAccessorsUsingThisInBodies);
    function DerivedWithObjectAccessorsUsingThisInBodies() {
        var _this;
        return _class_call_check(this, DerivedWithObjectAccessorsUsingThisInBodies), (_this = _super.call(this)).propName = "prop", _this;
    }
    return DerivedWithObjectAccessorsUsingThisInBodies;
}(Base), DerivedWithObjectComputedPropertyBody = function(Base) {
    "use strict";
    _inherits(DerivedWithObjectComputedPropertyBody, Base);
    var _super = _create_super(DerivedWithObjectComputedPropertyBody);
    function DerivedWithObjectComputedPropertyBody() {
        var _this;
        return _class_call_check(this, DerivedWithObjectComputedPropertyBody), _this.propName, (_this = _super.call(this)).propName = "prop", _this;
    }
    return DerivedWithObjectComputedPropertyBody;
}(Base), DerivedWithObjectComputedPropertyName = function(Base) {
    "use strict";
    _inherits(DerivedWithObjectComputedPropertyName, Base);
    var _super = _create_super(DerivedWithObjectComputedPropertyName);
    function DerivedWithObjectComputedPropertyName() {
        var _this;
        return _class_call_check(this, DerivedWithObjectComputedPropertyName), _define_property({}, _this.propName, !0), (_this = _super.call(this)).propName = "prop", _this;
    }
    return DerivedWithObjectComputedPropertyName;
}(Base), DerivedWithObjectMethod = function(Base) {
    "use strict";
    _inherits(DerivedWithObjectMethod, Base);
    var _super = _create_super(DerivedWithObjectMethod);
    function DerivedWithObjectMethod() {
        var _this;
        return _class_call_check(this, DerivedWithObjectMethod), (_this = _super.call(this)).prop = !0, _this;
    }
    return DerivedWithObjectMethod;
}(Base), DerivedWithLoops = [
    function(Base) {
        "use strict";
        _inherits(_class, Base);
        var _super = _create_super(_class);
        function _class() {
            var _this;
            for(_class_call_check(this, _class), (_this = _super.call(this)).prop = !0;;);
            return _possible_constructor_return(_this);
        }
        return _class;
    }(Base),
    function(Base) {
        "use strict";
        _inherits(_class, Base);
        var _super = _create_super(_class);
        function _class() {
            var _this, _temp;
            for(_class_call_check(this, _class); _temp = _this = _super.call(this), _this.prop = !0, _temp;);
            return _possible_constructor_return(_this);
        }
        return _class;
    }(Base),
    function(Base) {
        "use strict";
        _inherits(_class, Base);
        var _super = _create_super(_class);
        function _class() {
            var _this, _temp;
            for(_class_call_check(this, _class); b; _temp = _this = _super.call(this), _this.prop = !0, _temp);
            return _possible_constructor_return(_this);
        }
        return _class;
    }(Base),
    function(Base) {
        "use strict";
        function _class() {
            var _this;
            return _class_call_check(this, _class), _possible_constructor_return(_this);
        }
        return _inherits(_class, Base), _create_super(_class), _class;
    }(Base),
    function(Base) {
        "use strict";
        _inherits(_class, Base);
        var _super = _create_super(_class);
        function _class() {
            _class_call_check(this, _class);
            var _iteratorNormalCompletion = !0, _didIteratorError = !1, _iteratorError = void 0;
            try {
                for(var _this, _temp, _step, _iterator = (_temp = _this = _super.call(this), _this.prop = !0, _temp)[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = !0)_step.value;
            } catch (err) {
                _didIteratorError = !0, _iteratorError = err;
            } finally{
                try {
                    _iteratorNormalCompletion || null == _iterator.return || _iterator.return();
                } finally{
                    if (_didIteratorError) throw _iteratorError;
                }
            }
            return _possible_constructor_return(_this);
        }
        return _class;
    }(Base),
    function(Base) {
        "use strict";
        _inherits(_class, Base);
        var _super = _create_super(_class);
        function _class() {
            var _this, _temp;
            for(_class_call_check(this, _class); _temp = _this = _super.call(this), _this.prop = !0, _temp;);
            return _possible_constructor_return(_this);
        }
        return _class;
    }(Base),
    function(Base) {
        "use strict";
        _inherits(_class, Base);
        var _super = _create_super(_class);
        function _class() {
            var _this, _temp;
            _class_call_check(this, _class);
            do ;
            while (_temp = _this = _super.call(this), _this.prop = !0, _temp);
            return _possible_constructor_return(_this);
        }
        return _class;
    }(Base),
    function(Base) {
        "use strict";
        _inherits(_class, Base);
        var _super = _create_super(_class);
        function _class() {
            var _this;
            return _class_call_check(this, _class), (_this = _super.call(this)).prop = !0, _possible_constructor_return(_this);
        }
        return _class;
    }(Base),
    function(Base) {
        "use strict";
        _inherits(_class, Base);
        var _super = _create_super(_class);
        function _class() {
            var _this;
            return _class_call_check(this, _class), (_this = _super.call(this)).prop = !0, _possible_constructor_return(_this);
        }
        return _class;
    }(Base), 
];
