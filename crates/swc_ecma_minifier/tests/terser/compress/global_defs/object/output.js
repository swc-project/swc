function f(CONFIG) {
    return CONFIG.VALUE;
}
function g() {
    var CONFIG = {
        VALUE: 1
    };
    return CONFIG.VALUE;
}
function h() {
    return ({
        DEBUG: [
            0
        ],
        VALUE: 42
    }).VALUE;
}
if (({
    DEBUG: [
        0
    ],
    VALUE: 42
}).DEBUG[0]) console.debug("foo");
