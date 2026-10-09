function run(type) {
    if (0 === type) {
        const { x = console.log("default") } = {};
    }
    console.log("after");
}
run(0);
