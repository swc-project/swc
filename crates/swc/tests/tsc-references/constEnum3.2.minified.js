//// [constEnum3.ts]
var TestType;
!function(TestType) {
    TestType[TestType.foo = 0] = "foo", TestType[TestType.bar = 1] = "bar";
}(TestType || (TestType = {}));
