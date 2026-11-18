function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { unitTest, assertEquals, assert } from "./test_util.ts";
unitTest(function eventInitializedWithType() {
    var type = "click";
    var event = new Event(type);
    assertEquals(event.isTrusted, false);
    assertEquals(event.target, null);
    assertEquals(event.currentTarget, null);
    assertEquals(event.type, "click");
    assertEquals(event.bubbles, false);
    assertEquals(event.cancelable, false);
});
unitTest(function eventInitializedWithTypeAndDict() {
    var init = "submit";
    var eventInit = {
        bubbles: true,
        cancelable: true
    };
    var event = new Event(init, eventInit);
    assertEquals(event.isTrusted, false);
    assertEquals(event.target, null);
    assertEquals(event.currentTarget, null);
    assertEquals(event.type, "submit");
    assertEquals(event.bubbles, true);
    assertEquals(event.cancelable, true);
});
unitTest(function eventComposedPathSuccess() {
    var type = "click";
    var event = new Event(type);
    var composedPath = event.composedPath();
    assertEquals(composedPath, []);
});
unitTest(function eventStopPropagationSuccess() {
    var type = "click";
    var event = new Event(type);
    assertEquals(event.cancelBubble, false);
    event.stopPropagation();
    assertEquals(event.cancelBubble, true);
});
unitTest(function eventStopImmediatePropagationSuccess() {
    var type = "click";
    var event = new Event(type);
    assertEquals(event.cancelBubble, false);
    event.stopImmediatePropagation();
    assertEquals(event.cancelBubble, true);
});
unitTest(function eventPreventDefaultSuccess() {
    var type = "click";
    var event = new Event(type);
    assertEquals(event.defaultPrevented, false);
    event.preventDefault();
    assertEquals(event.defaultPrevented, false);
    var eventInit = {
        bubbles: true,
        cancelable: true
    };
    var cancelableEvent = new Event(type, eventInit);
    assertEquals(cancelableEvent.defaultPrevented, false);
    cancelableEvent.preventDefault();
    assertEquals(cancelableEvent.defaultPrevented, true);
});
unitTest(function eventInitializedWithNonStringType() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var type = undefined;
    var event = new Event(type);
    assertEquals(event.isTrusted, false);
    assertEquals(event.target, null);
    assertEquals(event.currentTarget, null);
    assertEquals(event.type, "undefined");
    assertEquals(event.bubbles, false);
    assertEquals(event.cancelable, false);
});
// ref https://github.com/web-platform-tests/wpt/blob/master/dom/events/Event-isTrusted.any.js
unitTest(function eventIsTrusted() {
    var desc1 = Object.getOwnPropertyDescriptor(new Event("x"), "isTrusted");
    assert(desc1);
    assertEquals(_type_of(desc1.get), "function");
    var desc2 = Object.getOwnPropertyDescriptor(new Event("x"), "isTrusted");
    assert(desc2);
    assertEquals(_type_of(desc2.get), "function");
    assertEquals(desc1.get, desc2.get);
});
