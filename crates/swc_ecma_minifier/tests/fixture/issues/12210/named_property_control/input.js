function f(a) {
    delete arguments.foo;
    arguments.bar++;
    delete arguments["01"];
    arguments["-1"]++;
    return arguments[0];
}
console.log(f(1));
