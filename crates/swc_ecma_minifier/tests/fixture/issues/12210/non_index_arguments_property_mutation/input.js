function update(a) {
    arguments.foo++;
    return arguments[0];
}

function remove(a) {
    delete arguments.foo;
    return arguments[0];
}

console.log(update(1), remove(2));
