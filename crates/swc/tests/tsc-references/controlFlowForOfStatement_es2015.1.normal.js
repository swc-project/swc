let obj;
let x;
function a() {
    x = true;
    for (x of obj){
        x = x.toExponential();
    }
    x; // string | boolean
}
