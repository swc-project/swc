function error2(message: string): never {
    throw new Error(message);
}

function fail2() {
    return error2("Something failed");
}