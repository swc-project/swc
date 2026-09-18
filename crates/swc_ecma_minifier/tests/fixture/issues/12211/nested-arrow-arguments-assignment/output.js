function f(value, ...rest) {
    value = "changed";
    return (()=>{
        var x = arguments = [
            arguments[0]
        ];
        return x[0];
    })();
}
console.log(f("original"));
