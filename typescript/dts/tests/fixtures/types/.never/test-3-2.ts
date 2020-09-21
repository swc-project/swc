function error2(message: string): never {
    throw new Error(message);
}

function move2(direction: "up" | "down") {
    return direction === "up" ? 1 :
        direction === "down" ? -1 :
            error2("Should never get here");
}
