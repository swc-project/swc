import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { _ as _to_array } from "@swc/helpers/_/_to_array";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
var resolver = {
    sendSomeMessage: function sendSomeMessage(_parent, _1, _2) {
        return _async_to_generator(function() {
            var _ref, _ref1, _ref2, _rest, _ref3, toNumber, messageBody, all, _rest1, dataSources;
            return _ts_generator(this, function(_state) {
                _ref = [
                    _1,
                    _2
                ], _ref1 = _to_array(_ref), _ref2 = _ref1[0], _rest = _ref1.slice(1), _ref3 = _ref2.input, toNumber = _ref3.toNumber, messageBody = _ref3.messageBody, all = _object_without_properties(_ref3, [
                    "toNumber",
                    "messageBody"
                ]), _rest1 = _sliced_to_array(_rest, 1), dataSources = _rest1[0].dataSources;
                return [
                    2
                ];
            });
        })();
    }
};
export default resolver;
