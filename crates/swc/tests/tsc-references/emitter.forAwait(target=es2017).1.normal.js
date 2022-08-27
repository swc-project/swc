//// [file1.ts]
async function f1() {
    let y;
    for await (const x of y){}
}
//// [file2.ts]
async function f2() {
    let x, y;
    for await (x of y){}
}
//// [file3.ts]
async function* f3() {
    let y;
    for await (const x of y){}
}
//// [file4.ts]
async function* f4() {
    let x, y;
    for await (x of y){}
}
//// [file5.ts]
// https://github.com/Microsoft/TypeScript/issues/21363
async function f5() {
    let y;
    outer: for await (const x of y){
        continue outer;
    }
}
//// [file6.ts]
// https://github.com/Microsoft/TypeScript/issues/21363
async function* f6() {
    let y;
    outer: for await (const x of y){
        continue outer;
    }
}
//// [file7.ts]
// https://github.com/microsoft/TypeScript/issues/36166
async function* f7() {
    let y;
    for(;;){
        for await (const x of y){}
    }
}
