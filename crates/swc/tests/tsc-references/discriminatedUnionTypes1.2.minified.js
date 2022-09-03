//// [discriminatedUnionTypes1.ts]
function area1(s) {
    return "square" === s.kind ? s.size * s.size : "circle" === s.kind ? Math.PI * s.radius * s.radius : "rectangle" === s.kind ? s.width * s.height : 0;
}
function area2(s) {
    switch(s.kind){
        case "square":
            return s.size * s.size;
        case "rectangle":
            return s.width * s.height;
        case "circle":
            return Math.PI * s.radius * s.radius;
    }
}
function assertNever(x) {
    throw Error("Unexpected object: " + x);
}
function area3(s) {
    switch(s.kind){
        case "square":
            return s.size * s.size;
        case "rectangle":
            return s.width * s.height;
        case "circle":
            return Math.PI * s.radius * s.radius;
        default:
            return assertNever(s);
    }
}
function area4(s) {
    switch(s.kind){
        case "square":
            return s.size * s.size;
        case "rectangle":
            return s.width * s.height;
        case "circle":
            return Math.PI * s.radius * s.radius;
    }
    return assertNever(s);
}
function f1(m) {
    "A" === m.kind || m.kind;
}
function f2(m) {
    if ("A" === m.kind) return;
}
function f3(m) {
    m.kind;
}
function f4(m, x) {
    m.kind;
}
function f5(m) {
    m.kind;
}
function f6(m) {
    m.kind;
}
function f7(m) {
    switch(m.kind){
        case "A":
        case "B":
            return;
    }
}
function f8(m) {
    switch(m.kind){
        case "A":
            return;
        case "D":
            throw Error();
    }
}
