let x = 'asdf', y = "PASS 1";
switch(x){
    case x:
    default:
    case y = "FAIL":
}
console.log(y);
let x1 = 'asdf', y1 = "PASS 2";
switch(x1){
    case x1:
    case y1 = "FAIL":
}
console.log(y1), console.log("PASS 3"), console.log("PASS 4");
let y2 = "FAIL", z = "FAIL";
switch('asdf'){
    case y2 = "PASS 5":
    case z = "PASS 5":
}
console.log(y2, z);
var c = "FAIL";
switch(0 / 0){
    case 0 / 0:
        break;
    case void (c = "PASS"):
        c = "FAIL";
}
console.log(c);
