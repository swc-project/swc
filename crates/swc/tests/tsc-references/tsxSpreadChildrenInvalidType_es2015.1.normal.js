import * as swcHelpers from "@swc/helpers";
function Todo(prop) {
    return /*#__PURE__*/ React.createElement("div", null, prop.key.toString() + prop.todo);
}
function TodoList({ todos  }) {
    return /*#__PURE__*/ React.createElement("div", null);
}
function TodoListNoError({ todos  }) {
    // any is not checked
    return /*#__PURE__*/ React.createElement("div", null);
}
let x;
/*#__PURE__*/ React.createElement(TodoList, swcHelpers.extends({}, x));
