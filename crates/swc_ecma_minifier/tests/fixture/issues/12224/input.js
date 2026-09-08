function defaultFirst(a = 1, b) {}
function defaultAfterPlain(a, b = 1, c) {}
function restAfterPlain(a, ...rest) {}
function plain(a, b) {}
function objectPattern({ a }, b) {}
function arrayPattern([a], b) {}

console.log(
    defaultFirst.length,
    defaultAfterPlain.length,
    restAfterPlain.length,
    plain.length,
    objectPattern.length,
    arrayPattern.length,
);
