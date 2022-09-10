import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
import _define_property from "@swc/helpers/src/_define_property.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
var Foo = function Foo(v) {
    "use strict";
    _class_call_check(this, Foo);
    this.value = v;
};
_define_property(Foo, "klass", function _class(v) {
    "use strict";
    _class_call_check(this, _class);
    this.value = v;
});
_async_to_generator(function() {
    var Bar;
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                Bar = /*#__PURE__*/ function(Foo1) {
                    "use strict";
                    _inherits(Bar, Foo1);
                    var _super = _create_super(Bar);
                    function Bar() {
                        _class_call_check(this, Bar);
                        return _super.apply(this, arguments);
                    }
                    _create_class(Bar, [
                        {
                            key: "bar",
                            value: function bar() {
                                return _async_to_generator(function() {
                                    var foo, _, foo2, _1, _2;
                                    return _ts_generator(this, function(_state) {
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
