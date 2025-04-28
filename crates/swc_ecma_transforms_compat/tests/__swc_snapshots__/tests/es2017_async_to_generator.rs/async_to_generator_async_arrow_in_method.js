let TestClass = {
    name: "John Doe",
    testMethodFailure () {
        return new Promise((resolve)=>_async_to_generator(function*() {
                console.log(this);
                setTimeout(resolve, 1000);
            }).call(this));
    }
};
