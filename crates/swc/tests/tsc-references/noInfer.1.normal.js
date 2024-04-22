//// [noInfer.ts]
// NoInfer<T> is erased for primitives
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
foo1('foo', 'foo') // ok
;
foo1('foo', 'bar') // error
;
foo2('foo', [
    'bar'
]) // error
;
foo3('foo', [
    'bar'
]) // error
;
foo4('foo', {
    x: 'bar'
}) // error
;
foo5('foo', {
    x: 'bar'
}) // error
;
doSomething(new Animal(), function() {
    return new Animal();
}); // ok
doSomething(new Animal(), function() {
    return new Dog();
}); // ok
doSomething(new Dog(), function() {
    return new Animal();
}); // error
assertEqual({
    x: 1
}, {
    x: 3
}); // ok
var g = {
    x: 3,
    y: 2
};
assertEqual(g, {
    x: 3
}); // error
invoke(test, {
    x: 1,
    y: 2
}); // error
test({
    x: 1,
    y: 2
}); // error
doWork(comp, {
    foo: 42
}); // ok
doWork(comp, {}); // error
var mutate1 = mutate(function(a, b) {
    return b;
});
var OkClass = /*#__PURE__*/ function() {
    "use strict";
    function OkClass(clazz, _value) {
        _class_call_check(this, OkClass);
        this.clazz = clazz;
        this._value = _value;
    }
    _create_class(OkClass, [
        {
            key: "value",
            get: function get() {
                return this._value; // ok
            }
        }
    ]);
    return OkClass;
}();
var OkClass2 = function OkClass2(clazz, _value) {
    "use strict";
    _class_call_check(this, OkClass2);
    this.clazz = clazz;
    this._value = _value;
};
