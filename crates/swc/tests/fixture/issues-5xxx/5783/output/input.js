function x1(y) {
    return a && c;
}
;
function x2(y) {
    return a && // leading of c
    c;
}
;
function x3(y) {
    return a // trailing of a
     && c;
}
;
function x4(y) {
    return a && // trailing of &&
    c;
}
;
function x5(y) {
    return a && c;
}
;
function x2(y) {
    return a && /* leading of c */ c;
}
;
function x3(y) {
    return a /* trailing of a */  && c;
}
;
function x4(y) {
    return a && /* trailing of && */ c;
}
;
