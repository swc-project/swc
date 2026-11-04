// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { assertThrows, unitTest } from "./test_util.ts";
unitTest(function testFnOverloading() {
    // just verifying that you can use this test definition syntax
    Deno.test("test fn overloading", function() {});
});
unitTest(function nameOfTestCaseCantBeEmpty() {
    assertThrows(function() {
        Deno.test("", function() {});
    }, TypeError, "The test name can't be empty");
    assertThrows(function() {
        Deno.test({
            name: "",
            fn: function fn() {}
        });
    }, TypeError, "The test name can't be empty");
});
