import { _ as _type_of } from "@swc/helpers/_/_type_of";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
import { _ as _ts_values } from "@swc/helpers/_/_ts_values";
function traverse(obj) {
    var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, key, err;
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                _state.label = 1;
            case 1:
                _state.trys.push([
                    1,
                    8,
                    9,
                    10
                ]);
                _iterator = Object.keys(obj)[Symbol.iterator]();
                _state.label = 2;
            case 2:
                if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                    3,
                    7
                ];
                key = _step.value;
                if (!(_type_of(obj[key]) === "object")) return [
                    3,
                    4
                ];
                return [
                    5,
                    _ts_values(traverse(obj[key]))
                ];
            case 3:
                _state.sent();
                return [
                    3,
                    6
                ];
            case 4:
                return [
                    4,
                    obj[key]
                ];
            case 5:
                _state.sent();
                _state.label = 6;
            case 6:
                _iteratorNormalCompletion = true;
                return [
                    3,
                    2
                ];
            case 7:
                return [
                    3,
                    10
                ];
            case 8:
                err = _state.sent();
                _didIteratorError = true;
                _iteratorError = err;
                return [
                    3,
                    10
                ];
            case 9:
                try {
                    if (!_iteratorNormalCompletion && _iterator.return != null) {
                        _iterator.return();
                    }
                } finally{
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
                return [
                    7
                ];
            case 10:
                return [
                    2
                ];
        }
    });
}
var obj = {
    data: [
        1,
        2,
        3
    ],
    nested: {
        fieldName: "Nested",
        fieldData: "Data"
    },
    get dataGenerator () {
        return traverse(this);
    }
};
function func1() {
    var generator = function() {
        return obj.dataGenerator;
    }();
    var res = [];
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = generator[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var value = _step.value;
            res.push(value);
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
    return res;
}
function main() {
    var res = func1();
    console.log(res);
}
main();
