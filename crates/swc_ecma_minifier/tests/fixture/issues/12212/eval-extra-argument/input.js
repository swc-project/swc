function f(...rest) {
    eval("", eval("rest.length"));
    return 1;
}

console.log(f("value"));
