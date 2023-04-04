import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
var handleSubmit = useMutation(/*#__PURE__*/ _async_to_generator(function() {
    var res, param, errors;
    return _ts_generator(this, function(_state) {
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
