var TestClass = {
    name: "John Doe",
    testMethodFailure () {
        return new Promise(async function(resolve) {
            console.log(this);
            setTimeout(resolve, 1000);
        });
    }
};
