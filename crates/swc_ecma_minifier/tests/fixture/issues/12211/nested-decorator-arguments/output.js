function dec(value) {
    console.log(value);
    return ()=>{};
}
function f(value, ...rest) {
    "changed";
    return class {
        @dec(arguments[0])
        method() {}
    };
}
new (f("original"));
