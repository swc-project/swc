class a {
    bar() {
        if (DEBUG) console.log("DEV");
        else console.log("PROD");
    }
}
new a().bar();
