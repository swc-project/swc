// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { unitTest, assert, assertEquals, assertThrows } from "./test_util.ts";
unitTest(function btoaSuccess() {
    var text = "hello world";
    var encoded = btoa(text);
    assertEquals(encoded, "aGVsbG8gd29ybGQ=");
});
unitTest(function atobSuccess() {
    var encoded = "aGVsbG8gd29ybGQ=";
    var decoded = atob(encoded);
    assertEquals(decoded, "hello world");
});
unitTest(function atobWithAsciiWhitespace() {
    var encodedList = [
        " aGVsbG8gd29ybGQ=",
        "  aGVsbG8gd29ybGQ=",
        "aGVsbG8gd29ybGQ= ",
        "aGVsbG8gd29ybGQ=\n",
        "aGVsbG\t8gd29ybGQ=",
        "aGVsbG	8g\n                d29ybGQ="
    ];
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = encodedList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var encoded = _step.value;
            var decoded = atob(encoded);
            assertEquals(decoded, "hello world");
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
});
unitTest(function atobThrows() {
    var threw = false;
    try {
        atob("aGVsbG8gd29ybGQ==");
    } catch (e) {
        threw = true;
    }
    assert(threw);
});
unitTest(function atobThrows2() {
    var threw = false;
    try {
        atob("aGVsbG8gd29ybGQ===");
    } catch (e) {
        threw = true;
    }
    assert(threw);
});
unitTest(function btoaFailed() {
    var text = "你好";
    assertThrows(function() {
        btoa(text);
    }, TypeError);
});
unitTest(function textDecoder2() {
    // prettier-ignore
    var fixture = new Uint8Array([
        0xf0,
        0x9d,
        0x93,
        0xbd,
        0xf0,
        0x9d,
        0x93,
        0xae,
        0xf0,
        0x9d,
        0x94,
        0x81,
        0xf0,
        0x9d,
        0x93,
        0xbd
    ]);
    var decoder = new TextDecoder();
    assertEquals(decoder.decode(fixture), "𝓽𝓮𝔁𝓽");
});
unitTest(function textDecoderIgnoreBOM() {
    // prettier-ignore
    var fixture = new Uint8Array([
        0xef,
        0xbb,
        0xbf,
        0xf0,
        0x9d,
        0x93,
        0xbd,
        0xf0,
        0x9d,
        0x93,
        0xae,
        0xf0,
        0x9d,
        0x94,
        0x81,
        0xf0,
        0x9d,
        0x93,
        0xbd
    ]);
    var decoder = new TextDecoder("utf-8", {
        ignoreBOM: true
    });
    assertEquals(decoder.decode(fixture), "𝓽𝓮𝔁𝓽");
});
unitTest(function textDecoderNotBOM() {
    // prettier-ignore
    var fixture = new Uint8Array([
        0xef,
        0xbb,
        0x89,
        0xf0,
        0x9d,
        0x93,
        0xbd,
        0xf0,
        0x9d,
        0x93,
        0xae,
        0xf0,
        0x9d,
        0x94,
        0x81,
        0xf0,
        0x9d,
        0x93,
        0xbd
    ]);
    var decoder = new TextDecoder("utf-8", {
        ignoreBOM: true
    });
    assertEquals(decoder.decode(fixture), "ﻉ𝓽𝓮𝔁𝓽");
});
unitTest(function textDecoderASCII() {
    var fixture = new Uint8Array([
        0x89,
        0x95,
        0x9f,
        0xbf
    ]);
    var decoder = new TextDecoder("ascii");
    assertEquals(decoder.decode(fixture), "‰•Ÿ¿");
});
unitTest(function textDecoderErrorEncoding() {
    var didThrow = false;
    try {
        new TextDecoder("foo");
    } catch (e) {
        didThrow = true;
        assertEquals(e.message, "The encoding label provided ('foo') is invalid.");
    }
    assert(didThrow);
});
unitTest(function textEncoder() {
    var fixture = "𝓽𝓮𝔁𝓽";
    var encoder = new TextEncoder();
    // prettier-ignore
    assertEquals(Array.from(encoder.encode(fixture)), [
        0xf0,
        0x9d,
        0x93,
        0xbd,
        0xf0,
        0x9d,
        0x93,
        0xae,
        0xf0,
        0x9d,
        0x94,
        0x81,
        0xf0,
        0x9d,
        0x93,
        0xbd
    ]);
});
unitTest(function textEncodeInto() {
    var fixture = "text";
    var encoder = new TextEncoder();
    var bytes = new Uint8Array(5);
    var result = encoder.encodeInto(fixture, bytes);
    assertEquals(result.read, 4);
    assertEquals(result.written, 4);
    // prettier-ignore
    assertEquals(Array.from(bytes), [
        0x74,
        0x65,
        0x78,
        0x74,
        0x00
    ]);
});
unitTest(function textEncodeInto2() {
    var fixture = "𝓽𝓮𝔁𝓽";
    var encoder = new TextEncoder();
    var bytes = new Uint8Array(17);
    var result = encoder.encodeInto(fixture, bytes);
    assertEquals(result.read, 8);
    assertEquals(result.written, 16);
    // prettier-ignore
    assertEquals(Array.from(bytes), [
        0xf0,
        0x9d,
        0x93,
        0xbd,
        0xf0,
        0x9d,
        0x93,
        0xae,
        0xf0,
        0x9d,
        0x94,
        0x81,
        0xf0,
        0x9d,
        0x93,
        0xbd,
        0x00
    ]);
});
unitTest(function textEncodeInto3() {
    var fixture = "𝓽𝓮𝔁𝓽";
    var encoder = new TextEncoder();
    var bytes = new Uint8Array(5);
    var result = encoder.encodeInto(fixture, bytes);
    assertEquals(result.read, 2);
    assertEquals(result.written, 4);
    // prettier-ignore
    assertEquals(Array.from(bytes), [
        0xf0,
        0x9d,
        0x93,
        0xbd,
        0x00
    ]);
});
unitTest(function textDecoderSharedUint8Array() {
    var ab = new SharedArrayBuffer(6);
    var dataView = new DataView(ab);
    var charCodeA = "A".charCodeAt(0);
    for(var i = 0; i < ab.byteLength; i++){
        dataView.setUint8(i, charCodeA + i);
    }
    var ui8 = new Uint8Array(ab);
    var decoder = new TextDecoder();
    var actual = decoder.decode(ui8);
    assertEquals(actual, "ABCDEF");
});
unitTest(function textDecoderSharedInt32Array() {
    var ab = new SharedArrayBuffer(8);
    var dataView = new DataView(ab);
    var charCodeA = "A".charCodeAt(0);
    for(var i = 0; i < ab.byteLength; i++){
        dataView.setUint8(i, charCodeA + i);
    }
    var i32 = new Int32Array(ab);
    var decoder = new TextDecoder();
    var actual = decoder.decode(i32);
    assertEquals(actual, "ABCDEFGH");
});
unitTest(function toStringShouldBeWebCompatibility() {
    var encoder = new TextEncoder();
    assertEquals(encoder.toString(), "[object TextEncoder]");
    var decoder = new TextDecoder();
    assertEquals(decoder.toString(), "[object TextDecoder]");
});
