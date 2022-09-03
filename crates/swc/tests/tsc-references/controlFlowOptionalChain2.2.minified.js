//// [controlFlowOptionalChain2.ts]
function funcTwo(arg) {
    (null == arg ? void 0 : arg.type) !== "B" && (null == arg || arg.name);
}
function funcThree(arg) {
    (null == arg ? void 0 : arg.type) !== "B" && (null == arg || arg.name);
}
function f1(x) {
    null == x || x.kind;
}
function f2(x) {
    null == x || x.kind;
}
function f3(x) {
    null == x || x.kind;
}
function f4(x) {
    null == x || x.kind;
}
function f5(x) {
    null == x || x.kind;
}
function f6(x) {
    null == x || x.kind;
}
function f7(x) {
    null == x || x.kind;
}
function f8(x) {
    null == x || x.kind;
}
