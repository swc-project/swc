class Yellow {
    method() {
        const errorMessage = "FAIL";
        return applyCb(errorMessage, () => console.log(this.message()));
    }
    message() {
        return "PASS";
    }
}
function applyCb(errorMessage, callback) {
    return callback(errorMessage);
}
new Yellow().method();
