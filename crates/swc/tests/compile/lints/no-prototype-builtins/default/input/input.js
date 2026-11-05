foo.hasOwnProperty('bar');

foo.isPrototypeOf('bar');

foo.propertyIsEnumerable('bar');

foo.bar.hasOwnProperty('bar');

foo.bar.baz.isPrototypeOf('bar');

bar?.foo?.hasOwnProperty('bar');

foo?.bar.hasOwnProperty('baz');

foo.hasOwnProperty?.('bar');

foo?.hasOwnProperty('bar').baz;

foo.hasOwnProperty('bar')?.baz;

(a,b).hasOwnProperty('bar');

(foo?.hasOwnProperty)('bar');

(((foo?.hasOwnProperty)))('dlya-tex-kto-dumaet-cho-on-samiy-umniy');

(foo?.anotherProp, foo?.hasOwnProperty)('bar');

(foo.hasOwnProperty('ok'), foo?.hasOwnProperty)('bar');

foo['hasOwnProperty']('bar');

foo[`isPrototypeOf`]('bar').baz;

// valid

Object.prototype.hasOwnProperty.call(foo, 'bar');
Object.prototype.isPrototypeOf.call(foo, 'bar');
Object.prototype.propertyIsEnumerable.call(foo, 'bar');
Object.prototype.hasOwnProperty.apply(foo, ['bar']);
Object.prototype.isPrototypeOf.apply(foo, ['bar']);
Object.prototype.propertyIsEnumerable.apply(foo, ['bar']);
foo.hasOwnProperty;
foo.hasOwnProperty.bar();
foo(hasOwnProperty);
hasOwnProperty(foo, 'bar');
isPrototypeOf(foo, 'bar');
propertyIsEnumerable(foo, 'bar');
({}.hasOwnProperty.call(foo, 'bar'));
({}.isPrototypeOf.call(foo, 'bar'));
({}.propertyIsEnumerable.call(foo, 'bar'));
({}.hasOwnProperty.apply(foo, ['bar']));
({}.isPrototypeOf.apply(foo, ['bar']));
({}.propertyIsEnumerable.apply(foo, ['bar']));
foo[hasOwnProperty]('bar');
foo['HasOwnProperty']('bar');
