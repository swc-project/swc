var _bar_foo, _bar, _foo, _foo_hasOwnProperty, _foo1, _foo2, _foo_hasOwnProperty1, _foo3, _foo4, _foo5, _foo6, _foo7;
foo.hasOwnProperty('bar');
foo.isPrototypeOf('bar');
foo.propertyIsEnumerable('bar');
foo.bar.hasOwnProperty('bar');
foo.bar.baz.isPrototypeOf('bar');
(_bar = bar) === null || _bar === void 0 ? void 0 : (_bar_foo = _bar.foo) === null || _bar_foo === void 0 ? void 0 : _bar_foo.hasOwnProperty('bar');
(_foo = foo) === null || _foo === void 0 ? void 0 : _foo.bar.hasOwnProperty('baz');
(_foo_hasOwnProperty = (_foo1 = foo).hasOwnProperty) === null || _foo_hasOwnProperty === void 0 ? void 0 : _foo_hasOwnProperty.call(_foo1, 'bar');
(_foo2 = foo) === null || _foo2 === void 0 ? void 0 : _foo2.hasOwnProperty('bar').baz;
(_foo_hasOwnProperty1 = foo.hasOwnProperty('bar')) === null || _foo_hasOwnProperty1 === void 0 ? void 0 : _foo_hasOwnProperty1.baz;
(a, b).hasOwnProperty('bar');
((_foo3 = foo) === null || _foo3 === void 0 ? void 0 : _foo3.hasOwnProperty)('bar');
((_foo4 = foo) === null || _foo4 === void 0 ? void 0 : _foo4.hasOwnProperty)('dlya-tex-kto-dumaet-cho-on-samiy-umniy');
((_foo5 = foo) === null || _foo5 === void 0 ? void 0 : _foo5.anotherProp, (_foo6 = foo) === null || _foo6 === void 0 ? void 0 : _foo6.hasOwnProperty)('bar');
(foo.hasOwnProperty('ok'), (_foo7 = foo) === null || _foo7 === void 0 ? void 0 : _foo7.hasOwnProperty)('bar');
foo['hasOwnProperty']('bar');
foo["isPrototypeOf"]('bar').baz;
// valid
Object.prototype.hasOwnProperty.call(foo, 'bar');
Object.prototype.isPrototypeOf.call(foo, 'bar');
Object.prototype.propertyIsEnumerable.call(foo, 'bar');
Object.prototype.hasOwnProperty.apply(foo, [
    'bar'
]);
Object.prototype.isPrototypeOf.apply(foo, [
    'bar'
]);
Object.prototype.propertyIsEnumerable.apply(foo, [
    'bar'
]);
foo.hasOwnProperty;
foo.hasOwnProperty.bar();
foo(hasOwnProperty);
hasOwnProperty(foo, 'bar');
isPrototypeOf(foo, 'bar');
propertyIsEnumerable(foo, 'bar');
({}).hasOwnProperty.call(foo, 'bar');
({}).isPrototypeOf.call(foo, 'bar');
({}).propertyIsEnumerable.call(foo, 'bar');
({}).hasOwnProperty.apply(foo, [
    'bar'
]);
({}).isPrototypeOf.apply(foo, [
    'bar'
]);
({}).propertyIsEnumerable.apply(foo, [
    'bar'
]);
foo[hasOwnProperty]('bar');
foo['HasOwnProperty']('bar');
