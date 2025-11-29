import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
var resolver = {
    sendSomeMessage: function sendSomeMessage(_0, _1, _2) {
        return _async_to_generator(function(_parent, _param, param) {
            var dataSources, _ref, toNumber, messageBody, all;
            return _ts_generator(this, function(_state) {
                dataSources = param.dataSources;
                _ref = _param.input, toNumber = _ref.toNumber, messageBody = _ref.messageBody, all = _object_without_properties(_ref, [
                    "toNumber",
                    "messageBody"
                ]);
                return [
                    2
                ];
            });
        }).apply(this, arguments);
    }
};
export default resolver;
