//// [tsxSpreadChildrenInvalidType.tsx]
import _extends from "@swc/helpers/src/_extends.mjs";
function Todo(prop) {
    return /*#__PURE__*/ React.createElement("div", null, prop.key.toString() + prop.todo);
}
function TodoList({ todos  }) {
    return /*#__PURE__*/ React.createElement("div", null, .../*#__PURE__*/ React.createElement(Todo, {
        key: todos[0].id,
        todo: todos[0].todo
    }));
}
function TodoListNoError({ todos  }) {
    // any is not checked
    return /*#__PURE__*/ React.createElement("div", null, .../*#__PURE__*/ React.createElement(Todo, {
        key: todos[0].id,
        todo: todos[0].todo
    }));
}
let x;
/*#__PURE__*/ React.createElement(TodoList, _extends({}, x));
