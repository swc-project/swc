// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { unitTest, assertNotEquals, assertStrictEquals } from "./test_util.ts";
unitTest(function getRandomValuesInt8Array() {
    var arr = new Int8Array(32);
    crypto.getRandomValues(arr);
    assertNotEquals(arr, new Int8Array(32));
});
unitTest(function getRandomValuesUint8Array() {
    var arr = new Uint8Array(32);
    crypto.getRandomValues(arr);
    assertNotEquals(arr, new Uint8Array(32));
});
unitTest(function getRandomValuesUint8ClampedArray() {
    var arr = new Uint8ClampedArray(32);
    crypto.getRandomValues(arr);
    assertNotEquals(arr, new Uint8ClampedArray(32));
});
unitTest(function getRandomValuesInt16Array() {
    var arr = new Int16Array(4);
    crypto.getRandomValues(arr);
    assertNotEquals(arr, new Int16Array(4));
});
unitTest(function getRandomValuesUint16Array() {
    var arr = new Uint16Array(4);
    crypto.getRandomValues(arr);
    assertNotEquals(arr, new Uint16Array(4));
});
unitTest(function getRandomValuesInt32Array() {
    var arr = new Int32Array(8);
    crypto.getRandomValues(arr);
    assertNotEquals(arr, new Int32Array(8));
});
unitTest(function getRandomValuesUint32Array() {
    var arr = new Uint32Array(8);
    crypto.getRandomValues(arr);
    assertNotEquals(arr, new Uint32Array(8));
});
unitTest(function getRandomValuesReturnValue() {
    var arr = new Uint32Array(8);
    var rtn = crypto.getRandomValues(arr);
    assertNotEquals(arr, new Uint32Array(8));
    assertStrictEquals(rtn, arr);
});
