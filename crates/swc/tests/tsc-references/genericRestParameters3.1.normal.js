//// [genericRestParameters3.ts]
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
f11("foo", "abc");
f11("foo", 10, true);
f11.apply(void 0, [
    "foo"
].concat(_to_consumable_array(t1)));
f11.apply(void 0, [
    "foo"
].concat(_to_consumable_array(t2)));
f11.apply(void 0, [
    "foo"
].concat(_to_consumable_array(t3)));
f11.apply(void 0, [
    "foo"
].concat(_to_consumable_array(t4)));
f11("foo", 10); // Error
f11("foo"); // Error
f21 = f11;
f31 = f11;
f41 = f11;
f11 = f21; // Error
f11 = f31; // Error
f11 = f41;
foo(); // Error
foo(100); // Error
foo(foo); // Error
function bar() {
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
        args[_key] = arguments[_key];
    }
    return args;
}
var a = bar(10, 20);
var b = bar(10, 20); // Error
baz(); // Error
baz(1); // Error
baz(1, 2); // Error
baz.apply(void 0, _to_consumable_array(ca)); // Error
hmm(); // okay, A = []
hmm(1, "s"); // okay, A = [1, "s"]
hmm("what"); // no error?  A = [] | [number, string] ?
var x2 = [
    "hello"
];
foo2.apply(void 0, _to_consumable_array(x2));
ff11 = ff21;
ff21 = ff11;
function ff3(s1, s2) {
    s1 = s2;
    s2 = s1;
}
