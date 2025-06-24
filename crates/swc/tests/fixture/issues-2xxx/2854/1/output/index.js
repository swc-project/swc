import { jsx as _jsx } from "react/jsx-runtime";
export function App() {
    return _jsx(Form, {});
}
export function Form(param) {
    var _param_onChange = param.onChange, onChange = _param_onChange === void 0 ? function() {} : _param_onChange;
    return _jsx("input", {
        onChange: function onChange1() {
            onChange();
        }
    });
}
