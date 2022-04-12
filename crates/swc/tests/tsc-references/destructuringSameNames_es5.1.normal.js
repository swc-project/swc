// Valid cases
var _$ref = {
    foo: 1
}, foo = _$ref.foo, bar = _$ref.foo;
var ref;
ref = {
    foo: 2
}, foo = ref.foo, foo = ref.foo, ref;
var ref1;
ref1 = {
    foo: 3
}, foo = ref1.foo, bar = ref1.foo, ref1;
var ref2;
ref2 = {
    foo: 4
}, bar = ref2.foo, foo = ref2.foo, ref2;
var ref3;
ref3 = {
    foo: 3,
    bar: 33
}, foo = ref3.foo, foo = ref3.bar, ref3;
var ref4;
ref4 = {
    foo: 4,
    bar: 44
}, foo = ref4.bar, foo = ref4.foo, ref4;
var ref5;
ref5 = {
    foo: 5
}, bar = ref5.foo, bar = ref5.foo, ref5;
var ref6;
ref6 = {
    foo: 6,
    bar: 66
}, bar = ref6.foo, foo = ref6.bar, ref6;
var ref7;
ref7 = {
    foo: 7
}, bar = ref7.foo, bar = ref7.foo, ref7;
foo = 111, foo = 1111;
foo = 222, foo = 2222;
bar = 333, foo = 3333, foo = 33333;
foo = 333, bar = 3333, foo = 33333;
foo = 444, foo = 4444, bar = 44444;
// Error cases
var _$ref1 = {
    foo1: 10
}, foo1 = _$ref1.foo1, foo1 = _$ref1.foo1;
var _$ref2 = {
    foo2: 20,
    bar2: 220
}, foo2 = _$ref2.foo2, foo2 = _$ref2.bar2;
var _$ref3 = {
    foo3: 30,
    bar3: 330
}, foo3 = _$ref3.bar3, foo3 = _$ref3.foo3;
var _$ref4 = {
    foo4: 40
}, foo4 = _$ref4.foo4, foo4 = _$ref4.foo4;
var _$ref5 = {
    foo5: 50,
    bar5: 550
}, foo5 = _$ref5.foo5, foo5 = _$ref5.bar5;
var _$ref6 = {
    foo6: 60,
    bar6: 660
}, foo6 = _$ref6.bar6, foo6 = _$ref6.foo6;
var blah1 = 111, blah1 = 222;
var blah2 = 333, blah2 = 444;
