function* values() {
    try {
        console.log("next"), yield 1, console.log("next"), yield 2;
    } finally{
        console.log("return");
    }
}
[, , ] = values();
