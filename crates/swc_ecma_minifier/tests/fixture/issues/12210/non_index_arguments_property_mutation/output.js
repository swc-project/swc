function update(a) {
    arguments.foo++;
    return a;
}
function remove(a) {
    delete arguments.foo;
    return a;
}
console.log(update(1), remove(2));
