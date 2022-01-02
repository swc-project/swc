export function a() {
}
export function b() {
}
b.cat = "cat";
export function c() {
}
c.Cls = class {
};
export function d() {
    return null;
}
export function e() {
    return null;
}
export function f(a1) {
    return a1;
}
function g(a2, b1) {
    return a2.x && b1.y();
}
f.self = f;
export { g };
function hh(a3, b2) {
    return a3.x && b2.y();
}
export { hh as h };
export function i() {
}
export { i as ii };
export { j as jj };
export function j() {
}
