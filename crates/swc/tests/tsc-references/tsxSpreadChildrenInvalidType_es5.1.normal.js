import * as swcHelpers from "@swc/helpers";
function Todo(prop) {
    return /*#__PURE__*/ React.createElement("div", null, prop.key.toString() + prop.todo);
}
function TodoList(param) {
    var todos = param.todos;
    return /*#__PURE__*/ React.createElement("div", null);
}
function TodoListNoError(param) {
    var todos = param.todos;
    // any is not checked
    return /*#__PURE__*/ React.createElement("div", null);
}
var x;
/*#__PURE__*/ React.createElement(TodoList, swcHelpers.extends({}, x));
