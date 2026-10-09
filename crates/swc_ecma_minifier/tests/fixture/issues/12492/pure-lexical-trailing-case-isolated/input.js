function run(type) {
    switch (type) {
        case 0:
            console.log("zero");
            break;
        case 1: {
            const unused = 1;
            break;
        }
    }
    console.log("after");
}
run(0);
run(1);
