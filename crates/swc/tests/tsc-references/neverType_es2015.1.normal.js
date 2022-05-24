// @strictNullChecks: true
// @declaration: true
function error(message) {
    throw new Error(message);
}
function errorVoid(message) {
    throw new Error(message);
}
function fail() {
    return error("Something failed");
}
function failOrThrow(shouldFail) {
    if (shouldFail) {
        return fail();
    }
    throw new Error();
}
function infiniteLoop1() {
    while(true){}
}
function infiniteLoop2() {
    while(true){}
}
function move1(direction) {
    switch(direction){
        case "up":
            return 1;
        case "down":
            return -1;
    }
    return error("Should never get here");
}
function move2(direction) {
    return direction === "up" ? 1 : direction === "down" ? -1 : error("Should never get here");
}
function check(x) {
    return x || error("Undefined value");
}
class C {
    void1() {
        throw new Error();
    }
    void2() {
        while(true){}
    }
    never1() {
        throw new Error();
    }
    never2() {
        while(true){}
    }
}
function f1(x) {
    if (typeof x === "boolean") {
        x; // never
    }
}
function f2(x) {
    while(true){
        if (typeof x === "boolean") {
            return x; // never
        }
    }
}
function test(cb) {
    let s = cb();
    return s;
}
let errorCallback = ()=>error("Error callback");
test(()=>"hello");
test(()=>fail());
test(()=>{
    throw new Error();
});
test(errorCallback);
