function o() {
    console.log("should be dropped");
}
function n() {
    console.log("should be dropped");
}
function i() {
    console.log("should be dropped");
}
function u() {
    console.log("should be dropped");
}
function t() {
    console.log("should be dropped");
}
function f() {
    console.log("should be kept");
}
export { add, div as divide, sub as minus, mul } from "path";
export { f as keep };
