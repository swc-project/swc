export function App() {
    return React.createElement(Form, null);
}
export function Form(param) {
    var _param_onChange = param.onChange, onChange = _param_onChange === void 0 ? function() {} : _param_onChange;
    return React.createElement("input", {
        onChange: function onChange1() {
            onChange();
        }
    });
}
