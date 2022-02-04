var TestType;
(function(TestType) {
    TestType[TestType["foo"] = 0] = "foo";
    TestType[TestType["bar"] = 1] = "bar";
})(TestType || (TestType = {}));
function f1(f) {}
function f2(f) {}
f1(TestType.foo);
f1(TestType.bar);
f2('foo');
f2('bar');
