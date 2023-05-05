import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
var resolver = {
    sendSomeMessage: function sendSomeMessage(_parent, _param, _param1) {
        return _async_to_generator(function() {
            var _param_input, toNumber, messageBody, all, dataSources;
            return _ts_generator(this, function(_state) {
                _param_input = _param.input, toNumber = _param_input.toNumber, messageBody = _param_input.messageBody, all = _object_without_properties(_param.input, [
                    "toNumber",
                    "messageBody"
                ]), dataSources = _param1.dataSources;
                return [
                    2
                ];
            });
        })();
    }
};
export default resolver;
