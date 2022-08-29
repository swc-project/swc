//// [controlFlowForInStatement.ts]
var x;
var obj;
var cond;
x = /a/;
for(var y in obj){
    x = y;
    if (cond) {
        x = 42;
        continue;
    }
    if (cond) {
        x = true;
        break;
    }
}
x; // RegExp | string | number | boolean
