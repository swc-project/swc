function mappedArguments(value = undefined) {
    value = 1;
    return arguments[0];
}

console.log(mappedArguments(2));
