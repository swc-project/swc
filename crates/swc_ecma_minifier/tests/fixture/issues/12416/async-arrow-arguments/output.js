// Moving the arrow must not capture the returned function's arguments.
(function() {
    let f = async ()=>arguments[0];
    return function() {
        return f();
    };
})("PASS")("FAIL").then(console.log, (error)=>console.log(error.name));
