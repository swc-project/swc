//// [tsxSpreadChildrenInvalidType.tsx]
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { jsx as _jsx } from "react/jsx-runtime";
function Todo(prop) {
    return /*#__PURE__*/ _jsx("div", {
        children: prop.key.toString() + prop.todo
    });
}
function TodoList({ todos }) {
    return /*#__PURE__*/ _jsx("div", {
        children: [
            .../*#__PURE__*/ _jsx(Todo, {
                todo: todos[0].todo
            }, todos[0].id)
        ]
    });
}
function TodoListNoError({ todos }) {
    // any is not checked
    return /*#__PURE__*/ _jsx("div", {
        children: [
            .../*#__PURE__*/ _jsx(Todo, {
                todo: todos[0].todo
            }, todos[0].id)
        ]
    });
}
let x;
/*#__PURE__*/ _jsx(TodoList, _object_spread({}, x));
