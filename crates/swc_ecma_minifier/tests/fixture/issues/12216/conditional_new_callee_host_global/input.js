function check() {
    console.log("check");
    return true;
}

function run() {
    return check() ? new window(1) : new window(2);
}

try {
    run();
} catch (error) {
    console.log(error.name);
}
