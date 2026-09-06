function dec(value) {
    console.log(value);
    return ()=>{};
}
function f(value, ...rest) {
    return class {
        constructor(
        @dec(arguments[0])
        parameter){}
    };
}
new (f("original"));
