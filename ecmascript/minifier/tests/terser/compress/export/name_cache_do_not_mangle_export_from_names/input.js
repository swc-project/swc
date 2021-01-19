function add() {
    console.log("should be dropped");
}
function div() {
    console.log("should be dropped");
}
function mul() {
    console.log("should be dropped");
}
function divide() {
    console.log("should be dropped");
}
function minus() {
    console.log("should be dropped");
}
function keep() {
    console.log("should be kept");
}
export { add, div as divide, sub as minus, mul } from "path";
export { keep };
