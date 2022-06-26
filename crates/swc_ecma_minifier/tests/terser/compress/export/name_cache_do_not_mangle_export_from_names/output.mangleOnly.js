function a() {
    console.log("should be dropped");
}
function b() {
    console.log("should be dropped");
}
function c() {
    console.log("should be dropped");
}
function d() {
    console.log("should be dropped");
}
function e() {
    console.log("should be dropped");
}
function f() {
    console.log("should be kept");
}
export { add, div as divide, sub as minus, mul } from "path";
export { f as keep };
