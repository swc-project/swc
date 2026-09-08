function* values() {
    try {
        console.log("next"), yield 1;
    } finally{
        console.log("return");
    }
}
[[, ]] = [
    values()
];
