function run(type) {
    switch (type) {
        case 0:
            const {} = null;
    }
    console.log("unreachable");
}
try {
    run(0);
} catch (e) {
    console.log(e instanceof TypeError);
}
