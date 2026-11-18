// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { unitTest, assertEquals } from "./test_util.ts";
unitTest(function customEventInitializedWithDetail() {
    var type = "touchstart";
    var detail = {
        message: "hello"
    };
    var customEventInit = {
        bubbles: true,
        cancelable: true,
        detail: detail
    };
    var event = new CustomEvent(type, customEventInit);
    assertEquals(event.bubbles, true);
    assertEquals(event.cancelable, true);
    assertEquals(event.currentTarget, null);
    assertEquals(event.detail, detail);
    assertEquals(event.isTrusted, false);
    assertEquals(event.target, null);
    assertEquals(event.type, type);
});
unitTest(function toStringShouldBeWebCompatibility() {
    var type = "touchstart";
    var event = new CustomEvent(type, {});
    assertEquals(event.toString(), "[object CustomEvent]");
});
