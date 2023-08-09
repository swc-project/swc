function fn([
    { foo, ...flags },
    { bar }
]) {
    console.log(flags.rangeChanged);
}