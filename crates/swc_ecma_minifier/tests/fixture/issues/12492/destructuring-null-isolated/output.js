function run(type) {
    if (0 === type) {
        const {} = null;
    }
    console.log("unreachable");
}
try {
    run(0);
} catch (e) {
    console.log(e instanceof TypeError);
}
