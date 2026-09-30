function f(a) {
    "use strict";
    console.log(++arguments["0"], a);
    console.log(arguments[0]--, a);
    console.log(--arguments[0], a);
    console.log(arguments[0], a);
}
f(1);
