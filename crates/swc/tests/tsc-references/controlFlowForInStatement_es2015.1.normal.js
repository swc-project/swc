let x;
let obj;
let cond;
x = /a/;
for(let y in obj){
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
