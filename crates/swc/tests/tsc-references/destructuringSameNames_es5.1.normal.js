// Valid cases
var ref = {
    foo: 1
}, foo = ref.foo, bar = ref.foo;
var ref1;
ref1 = {
    foo: 2
}, foo = ref1.foo, foo = ref1.foo, ref1;
var ref2;
ref2 = {
    foo: 3
}, foo = ref2.foo, bar = ref2.foo, ref2;
var ref3;
ref3 = {
    foo: 4
}, bar = ref3.foo, foo = ref3.foo, ref3;
var ref4;
ref4 = {
    foo: 3,
    bar: 33
}, foo = ref4.foo, foo = ref4.bar, ref4;
var ref5;
ref5 = {
    foo: 4,
    bar: 44
}, foo = ref5.bar, foo = ref5.foo, ref5;
var ref6;
ref6 = {
    foo: 5
}, bar = ref6.foo, bar = ref6.foo, ref6;
var ref7;
ref7 = {
    foo: 6,
    bar: 66
}, bar = ref7.foo, foo = ref7.bar, ref7;
var ref8;
ref8 = {
    foo: 7
}, bar = ref8.foo, bar = ref8.foo, ref8;
foo = 111, foo = 1111;
foo = 222, foo = 2222;
bar = 333, foo = 3333, foo = 33333;
foo = 333, bar = 3333, foo = 33333;
foo = 444, foo = 4444, bar = 44444;
// Error cases
var ref9 = {
    foo1: 10
}, foo1 = ref9.foo1, foo1 = ref9.foo1;
var ref10 = {
    foo2: 20,
    bar2: 220
}, foo2 = ref10.foo2, foo2 = ref10.bar2;
var ref11 = {
    foo3: 30,
    bar3: 330
}, foo3 = ref11.bar3, foo3 = ref11.foo3;
var ref12 = {
    foo4: 40
}, foo4 = ref12.foo4, foo4 = ref12.foo4;
var ref13 = {
    foo5: 50,
    bar5: 550
}, foo5 = ref13.foo5, foo5 = ref13.bar5;
var ref14 = {
    foo6: 60,
    bar6: 660
}, foo6 = ref14.bar6, foo6 = ref14.foo6;
var blah1 = 111, blah1 = 222;
var blah2 = 333, blah2 = 444;
