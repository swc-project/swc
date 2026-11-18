var foo = "foo";
var bar = ()=>{};
var four = 4;
var _one = one(), _ref = 2 * 4 + 7, _ref1 = 2 * four + 7, _ref2 = 2 * four + seven, _undefined = undefined, _ref3 = void 0, _computed = computed(), _computed1 = computed(), _tmp = "test" + one, _ref4 = /regex/, _foo = foo, _bar = bar, _baz = baz, _ref5 = `template${expression}`;
var MyClass = /*#__PURE__*/ function() {
    "use strict";
    function MyClass() {
        _class_call_check(this, MyClass);
        _define_property(this, null, "null");
        _define_property(this, _undefined, "undefined");
        _define_property(this, _ref3, "void 0");
        _define_property(this, _ref4, "regex");
        _define_property(this, _foo, "foo");
        _define_property(this, _bar, "bar");
        _define_property(this, _baz, "baz");
        _define_property(this, `template`, "template");
        _define_property(this, _ref5, "template-with-expression");
    }
    _create_class(MyClass, [
        {
            key: "whatever",
            get: function() {}
        },
        {
            key: "whatever",
            set: function(value) {}
        },
        {
            key: _computed,
            get: function() {}
        },
        {
            key: _computed1,
            set: function(value) {}
        },
        {
            key: _tmp,
            value: function() {}
        }
    ], [
        {
            key: 10,
            value: function() {}
        }
    ]);
    return MyClass;
}();
_define_property(MyClass, _one, "test");
_define_property(MyClass, _ref, "247");
_define_property(MyClass, _ref1, "247");
_define_property(MyClass, _ref2, "247");
