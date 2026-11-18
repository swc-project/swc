import { unitTest, assert, assertEquals } from "./test_util.ts";
unitTest(function basicAbortController() {
    var controller = new AbortController();
    assert(controller);
    var signal = controller.signal;
    assert(signal);
    assertEquals(signal.aborted, false);
    controller.abort();
    assertEquals(signal.aborted, true);
});
unitTest(function signalCallsOnabort() {
    var controller = new AbortController();
    var signal = controller.signal;
    var called = false;
    signal.onabort = function(evt) {
        assert(evt);
        assertEquals(evt.type, "abort");
        called = true;
    };
    controller.abort();
    assert(called);
});
unitTest(function signalEventListener() {
    var controller = new AbortController();
    var signal = controller.signal;
    var called = false;
    signal.addEventListener("abort", function(ev) {
        assert(this === signal);
        assertEquals(ev.type, "abort");
        called = true;
    });
    controller.abort();
    assert(called);
});
unitTest(function onlyAbortsOnce() {
    var controller = new AbortController();
    var signal = controller.signal;
    var called = 0;
    signal.addEventListener("abort", function() {
        return called++;
    });
    signal.onabort = function() {
        called++;
    };
    controller.abort();
    assertEquals(called, 2);
    controller.abort();
    assertEquals(called, 2);
});
unitTest(function controllerHasProperToString() {
    var actual = Object.prototype.toString.call(new AbortController());
    assertEquals(actual, "[object AbortController]");
});
