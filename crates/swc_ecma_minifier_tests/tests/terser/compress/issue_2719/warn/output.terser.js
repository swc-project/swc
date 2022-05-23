console.log(
    (function g() {
        return g.caller.arguments;
    })().length
);
