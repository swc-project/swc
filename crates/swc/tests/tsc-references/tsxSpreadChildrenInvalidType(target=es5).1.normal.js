//// [tsxSpreadChildrenInvalidType.tsx]
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
import { jsx as _jsx } from "react/jsx-runtime";
function Todo(prop) {
    return /*#__PURE__*/ _jsx("div", {
        children: prop.key.toString() + prop.todo
    });
}
function TodoList(param) {
    var todos = param.todos;
    return /*#__PURE__*/ _jsx("div", {
        children: _to_consumable_array(/*#__PURE__*/ _jsx(Todo, {
            todo: todos[0].todo
        }, todos[0].id))
    });
}
function TodoListNoError(param) {
    var todos = param.todos;
    // any is not checked
    return /*#__PURE__*/ _jsx("div", {
        children: _to_consumable_array(/*#__PURE__*/ _jsx(Todo, {
            todo: todos[0].todo
        }, todos[0].id))
    });
}
var x;
/*#__PURE__*/ _jsx(TodoList, _object_spread({}, x));
