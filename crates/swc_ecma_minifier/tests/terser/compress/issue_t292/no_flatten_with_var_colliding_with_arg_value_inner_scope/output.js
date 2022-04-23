var g = ["a"];
function problem(arg) {
    return g.indexOf(arg);
}
console.log(
    (function (test) {
        var problem = 2 * test;
        return console.log(problem), g[problem];
    })(
        (function (arg) {
            return problem(arg);
        })("a")
    )
);
