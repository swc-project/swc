import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
var Foo = function Foo(v) {
    "use strict";
    _class_call_check(this, Foo);
    this.value = v;
};
(function() {
    return _async_to_generator(function() {
        var Bar;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    Bar = /*#__PURE__*/ function(Foo1) {
                        "use strict";
                        _inherits(Bar, Foo1);
                        function Bar() {
                            _class_call_check(this, Bar);
                            return _call_super(this, Bar, arguments);
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
})();
