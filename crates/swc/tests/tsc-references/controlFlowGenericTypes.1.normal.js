//// [controlFlowGenericTypes.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
function f1(x, y, z) {
    if (x) {
        x;
        x.length;
        return x;
    }
    if (y.a) {
        y.a.length;
        return y.a;
    }
    if (z[0]) {
        z[0].length;
        return z[0];
    }
    return "hello";
}
function f2(x) {
    if (x) {
        x;
        x.length;
        return x;
    }
    return "hello";
}
function g1(x) {
    if (isBox(x)) {
        unbox(x);
    }
}
function g2(x) {
    if (!isUndefined(x)) {
        unbox(x);
    }
}
function g3(x) {
    if (!isBox(x)) {
        unbox(x); // Error
    }
}
function g4(x) {
    if (isUndefined(x)) {
        unbox(x); // Error
    }
}
export function bounceAndTakeIfA(value) {
    if (value === 'A') {
        takeA(value);
        return value;
    } else {
        return value;
    }
}
var fn = function(value) {
    value.foo; // Error
    if ('foo' in value) {
        value.foo;
    }
    if (value.tag === 'B') {
        value.foo;
    }
};
var fn2 = function(value) {
    value.foo; // Error
    if ('foo' in value) {
        value.foo;
    }
    if (value.tag === 'B') {
        value.foo;
    }
};
function notWorking(object) {
    if (!object.testable) return;
    object.doTest();
}
function get(key, obj) {
    var value = obj[key];
    if (value !== null) {
        return value;
    }
    return 0;
}
// Repro from #44093
var EventEmitter = /*#__PURE__*/ function() {
    "use strict";
    function EventEmitter() {
        _class_call_check(this, EventEmitter);
    }
    var _proto = EventEmitter.prototype;
    _proto.off = function off() {
        for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
            args[_key] = arguments[_key];
        }
    };
    return EventEmitter;
}();
function once(emittingObject, eventName) {
    emittingObject.off(eventName, 0);
    emittingObject.off(eventName, 0);
}
// In an element access obj[x], we consider obj to be in a constraint position, except when obj is of
// a generic type without a nullable constraint and x is a generic type. This is because when both obj
// and x are of generic types T and K, we want the resulting type to be T[K].
function fx1(obj, key) {
    var x1 = obj[key];
    var x2 = obj && obj[key];
}
function fx2(obj, key) {
    var x1 = obj[key];
    var x2 = obj && obj[key];
}
function fx3(obj, key) {
    var x1 = obj[key]; // Error
    var x2 = obj && obj[key];
}
// Repro from #44166
var TableBaseEnum = /*#__PURE__*/ function() {
    "use strict";
    function TableBaseEnum() {
        _class_call_check(this, TableBaseEnum);
    }
    var _proto = TableBaseEnum.prototype;
    _proto.m = function m() {
        var iSpec = null;
        iSpec[null]; // Error, object possibly undefined
        iSpec[null]; // Error, object possibly undefined
        if (iSpec === undefined) {
            return;
        }
        iSpec[null];
        iSpec[null];
    };
    return TableBaseEnum;
}();
// Repros from #45145
function f10(x, y) {
    y = x;
}
var SqlTable = /*#__PURE__*/ function() {
    "use strict";
    function SqlTable() {
        _class_call_check(this, SqlTable);
    }
    var _proto = SqlTable.prototype;
    _proto.validateRow = function validateRow(_row) {};
    _proto.insertRow = function insertRow(row) {
        this.validateRow(row);
    };
    return SqlTable;
}();
function update(control, key, value) {
    if (control !== undefined) {
        control[key] = value;
    }
}
function getColumnProperty(column, key) {
    return column[key];
}
