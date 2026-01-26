import { jsx as _jsx } from "react/jsx-runtime";
var type = function type() {
    return null;
};
var widget = {
    component: {
        type: type
    }
};
var render = function render() {
    return /*#__PURE__*/ _jsx(widget.component.type, {
        if: "aaa"
    });
};
/*#__PURE__*/ _jsx(widget.component.type, {
    if: true,
    for: "loop",
    while: "waiting",
    null: null
});
/*#__PURE__*/ _jsx(widget.component.type, {
    if: true,
    null: null,
    for: "loop",
    while: "waiting"
});
