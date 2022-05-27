function a() {
    (function() {
        return t;
    })() ? console.log(true) : console.log(false);
    (function() {
        console.log("something");
    })();
}
function b() {
    (function() {
        console.log("something");
    })();
    (function() {
        return t;
    })() ? console.log(true) : console.log(false);
}
