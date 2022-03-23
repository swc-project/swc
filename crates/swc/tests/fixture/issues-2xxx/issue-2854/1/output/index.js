export function App() {
    return React.createElement(Form, null);
}
export function Form(param) {
    var _onChange = param.onChange, onChange = _onChange === void 0 ? function() {} : _onChange;
    return React.createElement("input", {
        onChange: function onChange1() {
            onChange();
        }
    });
}
