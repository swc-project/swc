//// [controlFlowForInStatement2.ts]
var keywordA = 'a';
var keywordB = 'b';
if ('a' in c) {
    c; // narrowed to `A`
}
if (keywordA in c) {
    c; // also narrowed to `A`
}
var stringB = 'b';
if (stringB in c) {
    c; // narrowed to `B`
}
if (stringB in c) {
    c; // not narrowed
}
