function f(value) {
    return (()=>{
        var arguments = [];
        return arguments.length;
    })();
}
console.log(f("ignored"));
