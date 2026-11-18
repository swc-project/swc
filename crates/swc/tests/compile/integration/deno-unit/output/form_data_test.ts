function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
}
function _instanceof(left, right) {
    "@swc/helpers - instanceof";
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else return left instanceof right;
}
function _iterable_to_array_limit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _non_iterable_rest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _sliced_to_array(arr, i) {
    return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { unitTest, assert, assertEquals, assertStringContains } from "./test_util.ts";
unitTest(function formDataHasCorrectNameProp() {
    assertEquals(FormData.name, "FormData");
});
unitTest(function formDataParamsAppendSuccess() {
    var formData = new FormData();
    formData.append("a", "true");
    assertEquals(formData.get("a"), "true");
});
unitTest(function formDataParamsDeleteSuccess() {
    var formData = new FormData();
    formData.append("a", "true");
    formData.append("b", "false");
    assertEquals(formData.get("b"), "false");
    formData.delete("b");
    assertEquals(formData.get("a"), "true");
    assertEquals(formData.get("b"), null);
});
unitTest(function formDataParamsGetAllSuccess() {
    var formData = new FormData();
    formData.append("a", "true");
    formData.append("b", "false");
    formData.append("a", "null");
    assertEquals(formData.getAll("a"), [
        "true",
        "null"
    ]);
    assertEquals(formData.getAll("b"), [
        "false"
    ]);
    assertEquals(formData.getAll("c"), []);
});
unitTest(function formDataParamsGetSuccess() {
    var formData = new FormData();
    formData.append("a", "true");
    formData.append("b", "false");
    formData.append("a", "null");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formData.append("d", undefined);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formData.append("e", null);
    assertEquals(formData.get("a"), "true");
    assertEquals(formData.get("b"), "false");
    assertEquals(formData.get("c"), null);
    assertEquals(formData.get("d"), "undefined");
    assertEquals(formData.get("e"), "null");
});
unitTest(function formDataParamsHasSuccess() {
    var formData = new FormData();
    formData.append("a", "true");
    formData.append("b", "false");
    assert(formData.has("a"));
    assert(formData.has("b"));
    assert(!formData.has("c"));
});
unitTest(function formDataParamsSetSuccess() {
    var formData = new FormData();
    formData.append("a", "true");
    formData.append("b", "false");
    formData.append("a", "null");
    assertEquals(formData.getAll("a"), [
        "true",
        "null"
    ]);
    assertEquals(formData.getAll("b"), [
        "false"
    ]);
    formData.set("a", "false");
    assertEquals(formData.getAll("a"), [
        "false"
    ]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formData.set("d", undefined);
    assertEquals(formData.get("d"), "undefined");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formData.set("e", null);
    assertEquals(formData.get("e"), "null");
});
unitTest(function fromDataUseDomFile() {
    var formData = new FormData();
    var file = new File([
        "foo"
    ], "bar", {
        type: "text/plain"
    });
    formData.append("file", file);
    assertEquals(formData.get("file"), file);
});
unitTest(function formDataSetEmptyBlobSuccess() {
    var formData = new FormData();
    formData.set("a", new Blob([]), "blank.txt");
    formData.get("a");
/* TODO Fix this test.
  assert(file instanceof File);
  if (typeof file !== "string") {
    assertEquals(file.name, "blank.txt");
  }
  */ });
unitTest(function formDataBlobFilename() {
    var formData = new FormData();
    var content = new TextEncoder().encode("deno");
    formData.set("a", new Blob([
        content
    ]));
    var file = formData.get("a");
    assert(_instanceof(file, File));
    assertEquals(file.name, "blob");
});
unitTest(function formDataParamsForEachSuccess() {
    var init = [
        [
            "a",
            "54"
        ],
        [
            "b",
            "true"
        ]
    ];
    var formData = new FormData();
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = init[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var _step_value = _sliced_to_array(_step.value, 2), name = _step_value[0], value = _step_value[1];
            formData.append(name, value);
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
    var callNum = 0;
    formData.forEach(function(value, key, parent) {
        assertEquals(formData, parent);
        assertEquals(value, init[callNum][1]);
        assertEquals(key, init[callNum][0]);
        callNum++;
    });
    assertEquals(callNum, init.length);
});
unitTest(function formDataParamsArgumentsCheck() {
    var methodRequireOneParam = [
        "delete",
        "getAll",
        "get",
        "has",
        "forEach"
    ];
    var methodRequireTwoParams = [
        "append",
        "set"
    ];
    methodRequireOneParam.forEach(function(method) {
        var formData = new FormData();
        var hasThrown = 0;
        var errMsg = "";
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formData[method]();
            hasThrown = 1;
        } catch (err) {
            errMsg = err.message;
            if (_instanceof(err, TypeError)) {
                hasThrown = 2;
            } else {
                hasThrown = 3;
            }
        }
        assertEquals(hasThrown, 2);
        assertStringContains(errMsg, "".concat(method, " requires at least 1 argument, but only 0 present"));
    });
    methodRequireTwoParams.forEach(function(method) {
        var formData = new FormData();
        var hasThrown = 0;
        var errMsg = "";
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formData[method]();
            hasThrown = 1;
        } catch (err) {
            errMsg = err.message;
            if (_instanceof(err, TypeError)) {
                hasThrown = 2;
            } else {
                hasThrown = 3;
            }
        }
        assertEquals(hasThrown, 2);
        assertStringContains(errMsg, "".concat(method, " requires at least 2 arguments, but only 0 present"));
        hasThrown = 0;
        errMsg = "";
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formData[method]("foo");
            hasThrown = 1;
        } catch (err) {
            errMsg = err.message;
            if (_instanceof(err, TypeError)) {
                hasThrown = 2;
            } else {
                hasThrown = 3;
            }
        }
        assertEquals(hasThrown, 2);
        assertStringContains(errMsg, "".concat(method, " requires at least 2 arguments, but only 1 present"));
    });
});
unitTest(function toStringShouldBeWebCompatibility() {
    var formData = new FormData();
    assertEquals(formData.toString(), "[object FormData]");
});
