function _extends() {
    _extends = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends.apply(this, arguments);
}
function Todo(prop) {
    return(/*#__PURE__*/ React.createElement("div", null, prop.key.toString() + prop.todo));
}
function TodoList({ todos  }) {
    return(/*#__PURE__*/ React.createElement("div", null));
}
function TodoListNoError({ todos  }) {
    // any is not checked
    return(/*#__PURE__*/ React.createElement("div", null));
}
let x;
/*#__PURE__*/ React.createElement(TodoList, _extends({}, x));
