function run(opts) {
    let { match } = opts;
    if (!match) match = ()=>true;
    return match("hello", "world");
}
console.log(run({
    match: (a, b)=>a + " " + b
}));
