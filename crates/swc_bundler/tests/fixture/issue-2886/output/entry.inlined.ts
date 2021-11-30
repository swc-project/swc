let Test2;
(function(Test) {
    let TestEnum2;
    (function(TestEnum) {
        TestEnum[TestEnum["A"] = 2] = "A";
    })(TestEnum2 || (TestEnum2 = {
    }));
    Test.TestEnum = TestEnum2;
})(Test2 || (Test2 = {
}));
let TestEnum1;
(function(TestEnum) {
    TestEnum[TestEnum["A"] = 3] = "A";
})(TestEnum1 || (TestEnum1 = {
}));
let Test1;
(function(Test) {
    let TestEnum3;
    (function(TestEnum) {
        TestEnum[TestEnum["A"] = 1] = "A";
    })(TestEnum3 || (TestEnum3 = {
    }));
    Test.TestEnum = TestEnum3;
})(Test1 || (Test1 = {
}));
let other;
{
    let TestEnum4;
    (function(TestEnum) {
        TestEnum[TestEnum["A"] = 4] = "A";
    })(TestEnum4 || (TestEnum4 = {
    }));
    other = TestEnum4;
}let otherFinal;
{
    let TestEnum5;
    (function(TestEnum) {
        TestEnum[TestEnum["A"] = 5] = "A";
    })(TestEnum5 || (TestEnum5 = {
    }));
    otherFinal = TestEnum5;
}export { Test2 as Other, TestEnum1 as TestEnum, other as other, otherFinal as otherFinal };
export { Test1 as Test };
