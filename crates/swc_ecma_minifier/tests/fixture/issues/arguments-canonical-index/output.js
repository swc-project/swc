!function(zero, one) {
    console.log([
        arguments["01"],
        arguments[-1],
        arguments[1.5],
        arguments[1e21],
        zero,
        one
    ].map(String).join(","));
}("zero", "one");
