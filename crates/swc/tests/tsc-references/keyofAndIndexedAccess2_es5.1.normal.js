import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// @strict: true
// @target: esnext
function f1(obj, k0, k1, k2) {
    obj[k0] = 1;
    obj[k0] = 2;
    obj[k0] = "x"; // Error
    obj[k1] = 1;
    obj[k1] = 2; // Error
    obj[k1] = "x"; // Error
    obj[k2] = 1; // Error
    obj[k2] = 2; // Error
    obj[k2] = "x"; // Error
}
function f2(a, b, c, k) {
    a = b; // Error, index signature in source doesn't imply properties are present
    a = c; // Error, index signature in source doesn't imply properties are present
    b = a;
    b = c;
    c = a; // Error, constraint on target doesn't imply any properties or signatures
    c = b; // Error, constraint on target doesn't imply any properties or signatures
    a.x;
    b.x;
    c.x;
    c[k];
    a.x = 1;
    b.x = 1;
    c.x = 1; // Error, cannot write to index signature through constraint
    c[k] = 1; // Error, cannot write to index signature through constraint
}
function f3(a, b, k) {
    a = b; // Error, index signature doesn't imply properties are present
    b = a;
    a[k];
    a[k] = 1;
}
function f3b(a, b, k) {
    a = b; // Error, index signature doesn't imply properties are present
    b = a;
}
function f4(a, b) {
    a = b;
    b = a;
}
function f10(obj, k1, k2, k3, k4) {
    obj[k1] = 123; // Error
    obj[k2] = 123; // Error
    obj[k3] = 123; // Error
    obj[k4] = 123; // Error
}
function f11(obj, k1, k2) {
    obj.foo = 123;
    obj[k1] = 123;
    obj[k2] = 123;
}
function f12(obj, k1, k2, k3) {
    obj.foo = 123; // Error
    obj[k1] = 123; // Error
    obj[k2] = 123; // Error
    obj[k3] = 123; // Error
}
export function getAllEntities(state) {
    var ids = state.ids, entities = state.entities;
    return ids.map(function(id) {
        return entities[id];
    });
}
export function getEntity(id, state) {
    var ids = state.ids, entities = state.entities;
    if (!ids.includes(id)) {
        return undefined;
    }
    return entities[id];
}
function get123() {
    return 123; // Error
}
// Repros from #30938
function fn(param, cb) {
    cb(param.elements[0]);
}
function fn2(param, cb) {
    cb(param[0]);
}
// Repro from #31149
function fn3(param, cb) {
    cb(param[0]);
}
function fn4() {
    var x = "abc";
    var y = "abc";
}
// Repro from #31439 and #31691
export var c = function c() {
    "use strict";
    _class_call_check(this, c);
    this.a = "b";
    this["a"] = "b";
};
// Repro from #32038
var actions = [
    "resizeTo",
    "resizeBy"
];
var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
try {
    var _loop = function(_iterator, _step) {
        var action = _step.value;
        window[action] = function(x, y) {
            window[action](x, y);
        };
    };
    for(var _iterator = actions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true)_loop(_iterator, _step);
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
