class foo {
    bar() {
        if (DEBUG) console.log("DEV");
        else console.log("PROD");
    }
}
new foo().bar();
