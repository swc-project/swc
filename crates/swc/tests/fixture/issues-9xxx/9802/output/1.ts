import * as __typia_transform__validateReport from "typia/lib/internal/_validateReport.js";
export var parse = function() {
    var __is = function(input) {
        return "number" === typeof input;
    };
    var errors;
    var _report;
    var __validate = function(input) {
        if (false === __is(input)) {
            errors = [];
            _report = __typia_transform__validateReport._validateReport(errors);
            (function(input, _path) {
                var _exceptionable = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : true;
                return "number" === typeof input || _report(true, {
                    path: _path + "",
                    expected: "number",
                    value: input
                });
            })(input, "$input", true);
            var success = 0 === errors.length;
            return success ? {
                success: success,
                data: input
            } : {
                success: success,
                errors: errors,
                data: input
            };
        }
        return {
            success: true,
            data: input
        };
    };
    return function(input) {
        return __validate(JSON.parse(input));
    };
}();
