(function () {
    return (function (callback) {
        return callback();
    })(() => {
        console.log(this.message);
    });
}.call({ message: "PASS" }));
