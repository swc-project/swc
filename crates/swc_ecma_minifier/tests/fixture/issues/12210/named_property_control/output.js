function f(a) {
    delete arguments.foo;
    arguments.bar++;
    delete arguments["01"];
    arguments["-1"]++;
    return a;
}
console.log(f(1));
