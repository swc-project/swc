//// [emitArrowFunctionWhenUsingArguments18_ES6.ts]
function f() {
    var { arguments: args  } = {
        arguments
    };
    if (Math.random()) return ()=>arguments;
}
