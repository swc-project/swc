import { test } from "test";
var Test;
(function (Test) {
    Test["Hello"] = "World!";
})(Test || (Test = {}));
test(Test["Hello"]);
