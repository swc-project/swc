function lexical(value, ...rest) {
    let arguments = [];
    return eval("arguments.push(value), arguments[0]");
}

function caught(value, ...rest) {
    try {
        throw [];
    } catch (arguments) {
        return eval("arguments.push(value), arguments[0]");
    }
}

console.log(lexical("value"), caught("value"));
