//// [tsxSpreadChildrenInvalidType.tsx]
import _extends from "@swc/helpers/src/_extends.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
function Todo(prop) {
    return /*#__PURE__*/ React.createElement("div", null, prop.key.toString() + prop.todo);
}
function TodoList(param) {
    var todos = param.todos;
    return /*#__PURE__*/ React.createElement.apply(React, [
        "div",
        null
    ].concat(_to_consumable_array(/*#__PURE__*/ React.createElement(Todo, {
        key: todos[0].id,
        todo: todos[0].todo
    }))));
}
function TodoListNoError(param) {
    var todos = param.todos;
    // any is not checked
    return /*#__PURE__*/ React.createElement.apply(React, [
        "div",
        null
    ].concat(_to_consumable_array(/*#__PURE__*/ React.createElement(Todo, {
        key: todos[0].id,
        todo: todos[0].todo
    }))));
}
var x;
/*#__PURE__*/ React.createElement(TodoList, _extends({}, x));
