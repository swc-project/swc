var a = (function(a) {
    function a() {
        console.log("Value after override");
    }
    return a;
})("Value before override");
a();
