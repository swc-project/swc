function lexical(value) {
    let arguments = [];
    return eval("arguments.push(value), arguments[0]");
}
function caught(value) {
    try {
        throw [];
    } catch (arguments) {
        return eval("arguments.push(value), arguments[0]");
    }
}
console.log(lexical("value"), caught("value"));
