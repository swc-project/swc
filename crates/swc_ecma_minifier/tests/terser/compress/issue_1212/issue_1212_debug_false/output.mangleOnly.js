class l {
    bar() {
        if (DEBUG) console.log("DEV");
        else console.log("PROD");
    }
}
new l().bar();
