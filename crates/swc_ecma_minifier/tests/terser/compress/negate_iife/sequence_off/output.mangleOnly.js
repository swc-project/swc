function o() {
    (function() {
        return t;
    })() ? console.log(true) : console.log(false);
    (function() {
        console.log("something");
    })();
}
function n() {
    (function() {
        console.log("something");
    })();
    (function() {
        return t;
    })() ? console.log(true) : console.log(false);
}
