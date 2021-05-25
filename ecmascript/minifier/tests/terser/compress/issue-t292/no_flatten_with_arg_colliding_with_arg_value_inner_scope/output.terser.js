var g = ["a"];
function problem(arg) {
    return g.indexOf(arg);
}
console.log(
    (function (problem) {
        return g[problem];
    })(
        (function (arg) {
            return problem(arg);
        })("a")
    )
);
