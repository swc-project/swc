use(new function() {}());
use(new function() {}());
use(new function() {
    throw "string";
}());
use(new function() {
    throw 1;
}());
use(new function() {
    throw true;
}());
use(new function() {
    throw null;
}());
use(new function() {
    throw /regex/;
}());
use(new function() {
    throw 1n;
}());
use(new function() {
    throw 1;
}());
use(new function() {
    throw 1;
}(sideEffect()));
