import _to_consumable_array from "@swc/helpers/lib/_to_consumable_array.js";
f1("foo", "abc");
f1("foo", 10, true);
f1.apply(void 0, [
    "foo"
].concat(_to_consumable_array(t1)));
f1.apply(void 0, [
    "foo"
].concat(_to_consumable_array(t2)));
f1.apply(void 0, [
    "foo"
].concat(_to_consumable_array(t3)));
f1.apply(void 0, [
    "foo"
].concat(_to_consumable_array(t4)));
f1("foo", 10); // Error
f1("foo"); // Error
f2 = f1;
f3 = f1;
f4 = f1; // Error, misaligned complex rest types
f1 = f2; // Error
f1 = f3; // Error
f1 = f4; // Error, misaligned complex rest types
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
