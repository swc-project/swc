var _async_to_generator = require("@swc/helpers/_/_async_to_generator");
var _call_super = require("@swc/helpers/_/_call_super");
var _class_call_check = require("@swc/helpers/_/_class_call_check");
var _create_class = require("@swc/helpers/_/_create_class");
var _define_property = require("@swc/helpers/_/_define_property");
var _inherits = require("@swc/helpers/_/_inherits");
var _ts_generator = require("@swc/helpers/_/_ts_generator");
var Foo = function Foo(v) {
    "use strict";
    _class_call_check._(this, Foo);
    this.value = v;
};
_define_property._(Foo, "klass", function _class(v) {
    "use strict";
    _class_call_check._(this, _class);
    this.value = v;
});
_async_to_generator._(function() {
    var Bar;
    return _ts_generator._(this, function(_state) {
        switch(_state.label){
            case 0:
                Bar = /*#__PURE__*/ function(Foo1) {
                    "use strict";
                    _inherits._(Bar, Foo1);
                    function Bar() {
                        _class_call_check._(this, Bar);
                        return _call_super._(this, Bar, arguments);
                    }
                    _create_class._(Bar, [
                        {
                            key: "bar",
                            value: function bar() {
                                return _async_to_generator._(function() {
                                    var foo, _, foo2, _1, _2;
                                    return _ts_generator._(this, function(_state) {
                                        switch(_state.label){
                                            case 0:
                                                _ = Foo.bind;
                                                return [
                                                    4,
                                                    Promise.resolve(1)
                                                ];
                                            case 1:
                                                foo = new (_.apply(Foo, [
                                                    void 0,
                                                    _state.sent()
                                                ]));
                                                _2 = (_1 = Foo.klass).bind;
                                                return [
                                                    4,
                                                    Promise.resolve(2)
                                                ];
                                            case 2:
                                                foo2 = new (_2.apply(_1, [
                                                    void 0,
                                                    _state.sent()
                                                ]));
                                                expect(foo.value).toBe(1);
                                                expect(foo2.value).toBe(2);
                                                return [
                                                    2
                                                ];
                                        }
                                    });
                                })();
                            }
                        }
                    ]);
                    return Bar;
                }(Foo);
                return [
                    4,
                    new Bar().bar()
                ];
            case 1:
                _state.sent();
                return [
                    2
                ];
        }
    });
})();
