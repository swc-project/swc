function o() {
    console.log("should be dropped");
}
function d() {
    console.log("should be dropped");
}
function e() {
    console.log("should be dropped");
}
function p() {
    console.log("should be dropped");
}
function u() {
    console.log("should be dropped");
}
function l() {
    console.log("should be kept");
}
export { add, div as divide, sub as minus, mul } from "path";
export { l as keep };
