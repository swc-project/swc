function run(type) {
    switch (type) {
        case 0:
            const { x = console.log("default") } = {};
    }
    console.log("after");
}
run(0);
