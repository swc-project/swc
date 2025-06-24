//// [tsxSpreadChildren.tsx]
var x;
function Todo(prop) {
    return <div>{prop.key.toString() + prop.todo}</div>;
}
function TodoList(param) {
    var todos = param.todos;
    return <div>
        {...todos.map(function(todo) {
        return <Todo key={todo.id} todo={todo.todo}/>;
    })}
    </div>;
}
<TodoList {...x}/>;
