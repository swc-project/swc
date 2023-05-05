//// [tsxSpreadChildrenInvalidType.tsx]
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
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
/*#__PURE__*/ React.createElement(TodoList, x);
