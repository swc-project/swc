//// [intersectionNarrowing.ts]
// Repros from #43130
function f1(x) {
    if (x) {
        x; // Should narrow to T & string
    }
}
function f2(x) {
    if (x !== undefined) {
        x; // Should narrow to T & string
    } else {
        x; // Should narrow to T & undefined
    }
}
function f3(x) {
    if (typeof x === "string") {
        x; // Should narrow to T & string
    } else {
        x; // Should narrow to T & number
    }
}
function f4(x) {
    switch(x){
        case 1:
            x;
            break; // T & 1
        case 2:
            x;
            break; // T & 2
        default:
            x; // Should narrow to never
    }
}
function f5(x) {
    var t1 = x === "hello"; // Should be an error
}
