//// [tsxSpreadChildren.tsx]
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
function Todo(prop) {
    return /*#__PURE__*/ React.createElement("div", null, prop.key.toString() + prop.todo);
}
function TodoList(param) {
    var todos = param.todos;
    return /*#__PURE__*/ React.createElement.apply(React, [
        "div",
        null
    ].concat(_to_consumable_array(todos.map(function(todo) {
        return /*#__PURE__*/ React.createElement(Todo, {
            key: todo.id,
            todo: todo.todo
        });
    }))));
}
var x;
/*#__PURE__*/ React.createElement(TodoList, x);
