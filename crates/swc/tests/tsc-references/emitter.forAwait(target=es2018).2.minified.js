//// [file1.ts]
async function f1() {
    let y;
    for await (let x of y);
}
//// [file2.ts]
async function f2() {
    let x, y;
    for await (x of y);
}
//// [file3.ts]
async function* f3() {
    let y;
    for await (let x of y);
}
//// [file4.ts]
async function* f4() {
    let x, y;
    for await (x of y);
}
//// [file5.ts]
async function f5() {
    let y;
    for await (let x of y);
}
//// [file6.ts]
async function* f6() {
    let y;
    for await (let x of y);
}
//// [file7.ts]
async function* f7() {
    let y;
    for(;;)for await (let x of y);
}
