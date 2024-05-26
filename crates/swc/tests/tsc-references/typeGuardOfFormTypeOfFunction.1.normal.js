//// [typeGuardOfFormTypeOfFunction.ts]
import { _ as _type_of } from "@swc/helpers/_/_type_of";
function f1(x) {
    if (typeof x === "function") {
        x; // any
    }
}
function f2(x) {
    if (typeof x === "function") {
        x; // Function
    }
}
function f3(x) {
    if (typeof x === "function") {
        x; // Function
    }
}
function f4(x) {
    if (typeof x === "function") {
        x; // T & Function
    }
}
function f5(x) {
    if (typeof x === "function") {
        x; // never
    }
}
function f6(x) {
    if (typeof x === "function") {
        x; // () => string
    }
}
function f10(x) {
    if (typeof x === "function") {
        x; // () => string
    } else {
        x; // string
    }
}
function f11(x) {
    if (typeof x === "function") {
        x; // () => string
    } else {
        x; // { s: string }
    }
}
function f12(x) {
    if (typeof x === "function") {
        x; // never
    } else {
        x; // { s: string } | { n: number }
    }
}
// Repro from #18238
function f100(obj, keys) {
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var k = _step.value;
            var item = obj[k];
            if (typeof item == 'function') item.call(obj);
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
}
// Repro from #49316
function configureStore(reducer) {
    var rootReducer;
    if (typeof reducer === 'function') {
        rootReducer = reducer;
    }
}
function f101(x) {
    return (typeof x === "undefined" ? "undefined" : _type_of(x)) === "object" && x.anything;
}
