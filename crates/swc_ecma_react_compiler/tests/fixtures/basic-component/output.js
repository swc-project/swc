import { c as _c } from "react/compiler-runtime";
function Component(props) {
    let $ = _c(2);
    let _react_compiler_t0;
    if ($[0] !== props) {
        _react_compiler_t0 = <div>{props.value}</div>;
        $[0] = props;
        $[1] = _react_compiler_t0;
    } else {
        _react_compiler_t0 = $[1];
    }
    return _react_compiler_t0;
}
