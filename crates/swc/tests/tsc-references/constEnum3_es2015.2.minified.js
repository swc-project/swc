var TestType;
function f1(f) {}
function f2(f) {}
!function(TestType) {
    TestType[TestType.foo = 0] = "foo", TestType[TestType.bar = 1] = "bar";
}(TestType || (TestType = {})), f1(TestType.foo), f1(TestType.bar), f2("foo"), f2("bar");
