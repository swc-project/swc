function report(label, callback) {
    try {
        callback();
        console.log(label);
    } catch (error) {
        console.log(label, error.name);
    }
}
report("const", ()=>{
    const x = 1;
    x = x;
});
report("let", ()=>{});
report("var", ()=>{});
report("parameter", function(value) {
    console.log(value);
});
report("arrow parameter", (value)=>{
    console.log(value);
});
report("catch", ()=>{
    try {
        throw "caught";
    } catch (error) {
        console.log(error);
    }
});
report("function", ()=>{
    function value() {
        return "function";
    }
    console.log(value());
});
report("class", ()=>{
    class Value {
        static get() {
            return "class";
        }
    }
    console.log(Value.get());
});
