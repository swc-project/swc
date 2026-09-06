"custom";
"another custom directive";
"yet another custom directive";

function f(value, ...rest) {
    value = "changed";
    return arguments[0];
}

console.log(f("original"));
