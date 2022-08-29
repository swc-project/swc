import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _object_without_properties from "@swc/helpers/src/_object_without_properties.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
var resolver = {
    sendSomeMessage: function sendSomeMessage(_parent, _param, _param1) {
        return _async_to_generator(function() {
            var _input, toNumber, messageBody, all, dataSources;
            return _ts_generator(this, function(_state) {
                _input = _param.input, toNumber = _input.toNumber, messageBody = _input.messageBody, all = _object_without_properties(_param.input, [
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
