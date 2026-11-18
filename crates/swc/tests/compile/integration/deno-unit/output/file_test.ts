function _instanceof(left, right) {
    "@swc/helpers - instanceof";
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else return left instanceof right;
}
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { unitTest, assert, assertEquals } from "./test_util.ts";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function testFirstArgument(arg1, expectedSize) {
    var file = new File(arg1, "name");
    assert(_instanceof(file, File));
    assertEquals(file.name, "name");
    assertEquals(file.size, expectedSize);
    assertEquals(file.type, "");
}
unitTest(function fileEmptyFileBits() {
    testFirstArgument([], 0);
});
unitTest(function fileStringFileBits() {
    testFirstArgument([
        "bits"
    ], 4);
});
unitTest(function fileUnicodeStringFileBits() {
    testFirstArgument([
        "𝓽𝓮𝔁𝓽"
    ], 16);
});
unitTest(function fileStringObjectFileBits() {
    testFirstArgument([
        new String("string object")
    ], 13);
});
unitTest(function fileEmptyBlobFileBits() {
    testFirstArgument([
        new Blob()
    ], 0);
});
unitTest(function fileBlobFileBits() {
    testFirstArgument([
        new Blob([
            "bits"
        ])
    ], 4);
});
unitTest(function fileEmptyFileFileBits() {
    testFirstArgument([
        new File([], "world.txt")
    ], 0);
});
unitTest(function fileFileFileBits() {
    testFirstArgument([
        new File([
            "bits"
        ], "world.txt")
    ], 4);
});
unitTest(function fileArrayBufferFileBits() {
    testFirstArgument([
        new ArrayBuffer(8)
    ], 8);
});
unitTest(function fileTypedArrayFileBits() {
    testFirstArgument([
        new Uint8Array([
            0x50,
            0x41,
            0x53,
            0x53
        ])
    ], 4);
});
unitTest(function fileVariousFileBits() {
    testFirstArgument([
        "bits",
        new Blob([
            "bits"
        ]),
        new Blob(),
        new Uint8Array([
            0x50,
            0x41
        ]),
        new Uint16Array([
            0x5353
        ]),
        new Uint32Array([
            0x53534150
        ])
    ], 16);
});
unitTest(function fileNumberInFileBits() {
    testFirstArgument([
        12
    ], 2);
});
unitTest(function fileArrayInFileBits() {
    testFirstArgument([
        [
            1,
            2,
            3
        ]
    ], 5);
});
unitTest(function fileObjectInFileBits() {
    // "[object Object]"
    testFirstArgument([
        {}
    ], 15);
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function testSecondArgument(arg2, expectedFileName) {
    var file = new File([
        "bits"
    ], arg2);
    assert(_instanceof(file, File));
    assertEquals(file.name, expectedFileName);
}
unitTest(function fileUsingFileName() {
    testSecondArgument("dummy", "dummy");
});
unitTest(function fileUsingSpecialCharacterInFileName() {
    testSecondArgument("dummy/foo", "dummy:foo");
});
unitTest(function fileUsingNullFileName() {
    testSecondArgument(null, "null");
});
unitTest(function fileUsingNumberFileName() {
    testSecondArgument(1, "1");
});
unitTest(function fileUsingEmptyStringFileName() {
    testSecondArgument("", "");
});
