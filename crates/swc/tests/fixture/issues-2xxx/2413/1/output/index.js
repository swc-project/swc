var _async_to_generator = require("@swc/helpers/_/_async_to_generator");
var _ts_generator = require("@swc/helpers/_/_ts_generator");
var handleSubmit = useMutation(/*#__PURE__*/ _async_to_generator._(function() {
    var res, param, errors;
    return _ts_generator._(this, function(_state) {
        switch(_state.label){
            case 0:
                _state.trys.push([
                    0,
                    2,
                    ,
                    3
                ]);
                return [
                    4,
                    gate.register({
                        username: phoneNumber
                    })
                ];
            case 1:
                res = _state.sent();
                setstep(function(prev) {
                    return prev + 1;
                });
                toast.success(res.message);
                return [
                    3,
                    3
                ];
            case 2:
                param = _state.sent();
                errors = param.data.errors;
                showErrorMessage(errors);
                return [
                    3,
                    3
                ];
            case 3:
                return [
                    2
                ];
        }
    });
}));
