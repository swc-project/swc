import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { _ as _to_array } from "@swc/helpers/_/_to_array";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
var resolver = {
    sendSomeMessage: function sendSomeMessage(_parent, _1, _2) {
        return _async_to_generator(function() {
            var _ref, _ref1, _ref_, _ref2, _rest, toNumber, messageBody, all, _rest1, dataSources;
            return _ts_generator(this, function(_state) {
                _ref = [
                    _1,
                    _2
                ], _ref1 = _to_array(_ref), _ref_ = _ref1[0], _ref2 = _ref_.input, _rest = _ref1.slice(1), toNumber = _ref2.toNumber, messageBody = _ref2.messageBody, all = _object_without_properties(_ref2, [
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
