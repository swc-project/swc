const keywordA = 'a';
const keywordB = 'b';
if ('a' in c) {
    c; // narrowed to `A`
}
if (keywordA in c) {
    c; // also narrowed to `A`
}
let stringB = 'b';
if (stringB in c) {
    c; // narrowed to `B`
}
if (stringB in c) {
    c; // not narrowed
}
