// A simple render function with nesting and control statements
let render = (ctrl, model)=>/*#__PURE__*/ React.createElement("section", {
        class: "todoapp"
    }, /*#__PURE__*/ React.createElement("header", {
        class: "header"
    }, /*#__PURE__*/ React.createElement("h1", null, "todos <x>"), /*#__PURE__*/ React.createElement("input", {
        class: "new-todo",
        autofocus: true,
        autocomplete: "off",
        placeholder: "What needs to be done?",
        value: model.newTodo,
        onKeyup: ctrl.addTodo.bind(ctrl, model)
    })), /*#__PURE__*/ React.createElement("section", {
        class: "main",
        style: {
            display: model.todos && model.todos.length ? "block" : "none"
        }
    }, /*#__PURE__*/ React.createElement("input", {
        class: "toggle-all",
        type: "checkbox",
        onChange: ctrl.toggleAll.bind(ctrl)
    }), /*#__PURE__*/ React.createElement("ul", {
        class: "todo-list"
    }, model.filteredTodos.map((todo)=>/*#__PURE__*/ React.createElement("li", {
            class: {
                todo: true,
                completed: todo.completed,
                editing: todo == model.editedTodo
            }
        }, /*#__PURE__*/ React.createElement("div", {
            class: "view"
        }, !todo.editable ? /*#__PURE__*/ React.createElement("input", {
            class: "toggle",
            type: "checkbox"
        }) : null, /*#__PURE__*/ React.createElement("label", {
            onDoubleClick: ()=>{
                ctrl.editTodo(todo);
            }
        }, todo.title), /*#__PURE__*/ React.createElement("button", {
            class: "destroy",
            onClick: ctrl.removeTodo.bind(ctrl, todo)
        }), /*#__PURE__*/ React.createElement("div", {
            class: "iconBorder"
        }, /*#__PURE__*/ React.createElement("div", {
            class: "icon"
        }))))))));
