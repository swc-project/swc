var printTest = (function (ret) {
    function ret() {
        console.log("Value after override");
    }
    return ret;
})("Value before override");
printTest();
