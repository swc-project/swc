use(new function named() {}("keep"));
use(new (async function() {})("keep"));
use(new (function*() {})("keep"));

use(new function(value) {}("keep"));
use(new function(value = 1) {}("keep"));
use(new function({ value }) {}("keep"));
use(new function(...values) {
    throw values.length;
}("keep"));

use(new function() {
    return sideEffect();
}("keep"));
use(new function() {
    sideEffect();
}("keep"));
use(new function() {
    throw value;
}("keep"));
use(new function() {
    throw `${value}`;
}("keep"));
use(new function() {
    throw {};
}("keep"));
use(new function() {
    throw 1;
    throw 2;
}("keep"));

use(new function() {}(...values, "keep"));
use(new function() {}("keep", ...values));
use(new function() {}("keep", sideEffect()));
use(new (sideEffect(), function() {})("keep"));
use(new Constructor("keep"));
