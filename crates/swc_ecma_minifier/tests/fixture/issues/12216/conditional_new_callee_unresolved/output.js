function check() {
    console.log("check");
    return true;
}
function run() {
    return check() ? new Missing(1) : new Missing(2);
}
try {
    run();
} catch (error) {
    console.log(error.name);
}
