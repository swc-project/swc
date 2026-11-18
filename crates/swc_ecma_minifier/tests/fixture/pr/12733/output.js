console.log(({
    ...{
        get value () {
            console.log("get");
        }
    }
}, console.log("factory"), 42));
try {
    console.log(([
        ...null
    ], 42));
} catch (error) {
    console.log(error.name);
}
