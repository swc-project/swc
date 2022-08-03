function n() {
    (function() {
        return t;
    })() ? console.log(true) : console.log(false);
    (function() {
        console.log("something");
    })();
}
function o() {
    (function() {
        console.log("something");
    })();
    (function() {
        return t;
    })() ? console.log(true) : console.log(false);
}
