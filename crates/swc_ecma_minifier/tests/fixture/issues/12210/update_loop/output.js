function f(a) {
    "use strict";
    for(var i = 0; i < 2; i++){
        console.log(arguments[0]);
        arguments[0]++;
    }
}
f(1);
