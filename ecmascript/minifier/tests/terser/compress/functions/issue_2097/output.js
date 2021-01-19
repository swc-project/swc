!(function () {
    try {
        throw 0;
    } catch (e) {
        console.log(arguments[0]);
    }
})(1);
