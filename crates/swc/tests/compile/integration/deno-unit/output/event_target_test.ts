function _assert_this_initialized(self) {
    if (self === void 0) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return self;
}
function _call_super(_this, derived, args) {
    derived = _get_prototype_of(derived);
    return _possible_constructor_return(_this, _is_native_reflect_construct() ? Reflect.construct(derived, args || [], _get_prototype_of(_this).constructor) : derived.apply(_this, args));
}
function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _construct(Parent, args, Class) {
    if (_is_native_reflect_construct()) _construct = Reflect.construct;
    else {
        _construct = function construct(Parent, args, Class) {
            var a = [
                null
            ];
            a.push.apply(a, args);
            var Constructor = Function.bind.apply(Parent, a);
            var instance = new Constructor();
            if (Class) _set_prototype_of(instance, Class.prototype);
            return instance;
        };
    }
    return _construct.apply(null, arguments);
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _create_class(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _get_prototype_of(o) {
    _get_prototype_of = Object.setPrototypeOf ? Object.getPrototypeOf : function getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _get_prototype_of(o);
}
function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: true,
            configurable: true
        }
    });
    if (superClass) _set_prototype_of(subClass, superClass);
}
function _is_native_function(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
}
function _is_native_reflect_construct() {
    try {
        var result = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
    } catch (_) {}
    return (_is_native_reflect_construct = function() {
        return !!result;
    })();
}
function _possible_constructor_return(self, call) {
    if (call && (_type_of(call) === "object" || typeof call === "function")) return call;
    return _assert_this_initialized(self);
}
function _set_prototype_of(o, p) {
    _set_prototype_of = Object.setPrototypeOf || function setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    };
    return _set_prototype_of(o, p);
}
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
function _wrap_native_super(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;
    _wrap_native_super = function(Class) {
        if (Class === null || !_is_native_function(Class)) return Class;
        if (typeof Class !== "function") throw new TypeError("Super expression must either be null or a function");
        if (typeof _cache !== "undefined") {
            if (_cache.has(Class)) return _cache.get(Class);
            _cache.set(Class, Wrapper);
        }
        function Wrapper() {
            return _construct(Class, arguments, _get_prototype_of(this).constructor);
        }
        Wrapper.prototype = Object.create(Class.prototype, {
            constructor: {
                value: Wrapper,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        return _set_prototype_of(Wrapper, Class);
    };
    return _wrap_native_super(Class);
}
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { unitTest, assertEquals } from "./test_util.ts";
unitTest(function addEventListenerTest() {
    var document = new EventTarget();
    assertEquals(document.addEventListener("x", null, false), undefined);
    assertEquals(document.addEventListener("x", null, true), undefined);
    assertEquals(document.addEventListener("x", null), undefined);
});
unitTest(function constructedEventTargetCanBeUsedAsExpected() {
    var target = new EventTarget();
    var event = new Event("foo", {
        bubbles: true,
        cancelable: false
    });
    var callCount = 0;
    var listener = function listener(e) {
        assertEquals(e, event);
        ++callCount;
    };
    target.addEventListener("foo", listener);
    target.dispatchEvent(event);
    assertEquals(callCount, 1);
    target.dispatchEvent(event);
    assertEquals(callCount, 2);
    target.removeEventListener("foo", listener);
    target.dispatchEvent(event);
    assertEquals(callCount, 2);
});
unitTest(function anEventTargetCanBeSubclassed() {
    var NicerEventTarget = /*#__PURE__*/ function(EventTarget1) {
        "use strict";
        _inherits(NicerEventTarget, EventTarget1);
        function NicerEventTarget() {
            _class_call_check(this, NicerEventTarget);
            return _call_super(this, NicerEventTarget, arguments);
        }
        _create_class(NicerEventTarget, [
            {
                key: "on",
                value: function on(type, callback, options) {
                    this.addEventListener(type, callback, options);
                }
            },
            {
                key: "off",
                value: function off(type, callback, options) {
                    this.removeEventListener(type, callback, options);
                }
            }
        ]);
        return NicerEventTarget;
    }(_wrap_native_super(EventTarget));
    var target = new NicerEventTarget();
    new Event("foo", {
        bubbles: true,
        cancelable: false
    });
    var callCount = 0;
    var listener = function listener() {
        ++callCount;
    };
    target.on("foo", listener);
    assertEquals(callCount, 0);
    target.off("foo", listener);
    assertEquals(callCount, 0);
});
unitTest(function removingNullEventListenerShouldSucceed() {
    var document = new EventTarget();
    assertEquals(document.removeEventListener("x", null, false), undefined);
    assertEquals(document.removeEventListener("x", null, true), undefined);
    assertEquals(document.removeEventListener("x", null), undefined);
});
unitTest(function constructedEventTargetUseObjectPrototype() {
    var target = new EventTarget();
    var event = new Event("toString", {
        bubbles: true,
        cancelable: false
    });
    var callCount = 0;
    var listener = function listener(e) {
        assertEquals(e, event);
        ++callCount;
    };
    target.addEventListener("toString", listener);
    target.dispatchEvent(event);
    assertEquals(callCount, 1);
    target.dispatchEvent(event);
    assertEquals(callCount, 2);
    target.removeEventListener("toString", listener);
    target.dispatchEvent(event);
    assertEquals(callCount, 2);
});
unitTest(function toStringShouldBeWebCompatible() {
    var target = new EventTarget();
    assertEquals(target.toString(), "[object EventTarget]");
});
unitTest(function dispatchEventShouldNotThrowError() {
    var hasThrown = false;
    try {
        var target = new EventTarget();
        var event = new Event("hasOwnProperty", {
            bubbles: true,
            cancelable: false
        });
        var listener = function listener() {};
        target.addEventListener("hasOwnProperty", listener);
        target.dispatchEvent(event);
    } catch (unused) {
        hasThrown = true;
    }
    assertEquals(hasThrown, false);
});
unitTest(function eventTargetThisShouldDefaultToWindow() {
    var _EventTarget_prototype = EventTarget.prototype, addEventListener = _EventTarget_prototype.addEventListener, dispatchEvent = _EventTarget_prototype.dispatchEvent, removeEventListener = _EventTarget_prototype.removeEventListener;
    var n = 1;
    var event = new Event("hello");
    var listener = function listener() {
        n = 2;
    };
    addEventListener("hello", listener);
    window.dispatchEvent(event);
    assertEquals(n, 2);
    n = 1;
    removeEventListener("hello", listener);
    window.dispatchEvent(event);
    assertEquals(n, 1);
    window.addEventListener("hello", listener);
    dispatchEvent(event);
    assertEquals(n, 2);
    n = 1;
    window.removeEventListener("hello", listener);
    dispatchEvent(event);
    assertEquals(n, 1);
});
unitTest(function eventTargetShouldAcceptEventListenerObject() {
    var target = new EventTarget();
    var event = new Event("foo", {
        bubbles: true,
        cancelable: false
    });
    var callCount = 0;
    var listener = {
        handleEvent: function handleEvent(e) {
            assertEquals(e, event);
            ++callCount;
        }
    };
    target.addEventListener("foo", listener);
    target.dispatchEvent(event);
    assertEquals(callCount, 1);
    target.dispatchEvent(event);
    assertEquals(callCount, 2);
    target.removeEventListener("foo", listener);
    target.dispatchEvent(event);
    assertEquals(callCount, 2);
});
unitTest(function eventTargetShouldAcceptAsyncFunction() {
    var target = new EventTarget();
    var event = new Event("foo", {
        bubbles: true,
        cancelable: false
    });
    var callCount = 0;
    var listener = function listener(e) {
        assertEquals(e, event);
        ++callCount;
    };
    target.addEventListener("foo", listener);
    target.dispatchEvent(event);
    assertEquals(callCount, 1);
    target.dispatchEvent(event);
    assertEquals(callCount, 2);
    target.removeEventListener("foo", listener);
    target.dispatchEvent(event);
    assertEquals(callCount, 2);
});
unitTest(function eventTargetShouldAcceptAsyncFunctionForEventListenerObject() {
    var target = new EventTarget();
    var event = new Event("foo", {
        bubbles: true,
        cancelable: false
    });
    var callCount = 0;
    var listener = {
        handleEvent: function handleEvent(e) {
            assertEquals(e, event);
            ++callCount;
        }
    };
    target.addEventListener("foo", listener);
    target.dispatchEvent(event);
    assertEquals(callCount, 1);
    target.dispatchEvent(event);
    assertEquals(callCount, 2);
    target.removeEventListener("foo", listener);
    target.dispatchEvent(event);
    assertEquals(callCount, 2);
});
