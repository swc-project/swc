function error2(message: string): never {
    throw new Error(message);
}

function move1(direction: "up" | "down") {
    switch (direction) {
        case "up":
            return 1;
        case "down":
            return -1;
    }
    return error2("Should never get here");
}
