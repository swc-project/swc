//// [controlFlowBinaryOrExpression.ts]
var x;
var cond;
(x = "") || (x = 0);
x; // string | number
x = "";
cond || (x = 0);
x; // string | number
var sourceObj = undefined;
if (isNodeList(sourceObj)) {
    sourceObj.length;
}
if (isHTMLCollection(sourceObj)) {
    sourceObj.length;
}
if (isNodeList(sourceObj) || isHTMLCollection(sourceObj)) {
    sourceObj.length;
}
export { };
