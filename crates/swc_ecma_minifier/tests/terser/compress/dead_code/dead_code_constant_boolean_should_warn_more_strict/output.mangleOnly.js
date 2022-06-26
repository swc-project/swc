"use strict";
while(!(a || b + "0")){
    console.log("unreachable");
    var a;
}
for(var b = 10, c; b && (c || b) && !typeof b; ++b){
    asdf();
    a();
    var d;
}
bar();
