import * as __typia_transform__validateReport from "typia/lib/internal/_validateReport.js";
import typia from "typia";
export const parse = (() => {
    const __is = (input: any): input is number => "number" === typeof input;
    let errors: any;
    let _report: any;
    const __validate = (input: any): import("typia").IValidation<number> => {
        if (false === __is(input)) {
            errors = [];
            _report = (__typia_transform__validateReport._validateReport as any)(
                errors
            );
            ((input: any, _path: string, _exceptionable: boolean = true) =>
                "number" === typeof input ||
                _report(true, {
                    path: _path + "",
                    expected: "number",
                    value: input,
                }))(input, "$input", true);
            const success = 0 === errors.length;
            return success
                ? {
                    success,
                    data: input,
                }
                : ({
                    success,
                    errors,
                    data: input,
                } as any);
        }
        return {
            success: true,
            data: input,
        } as any;
    };
    return (
        input: string
    ): import("typia").IValidation<import("typia").Primitive<number>> =>
        __validate(JSON.parse(input)) as any;
})();