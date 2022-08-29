//// [operatorsAndIntersectionTypes.ts]
function createGuid() {
    return "21EC2020-3AEA-4069-A2DD-08002B30309D";
}
function createSerialNo() {
    return 12345;
}
var map1 = {};
var guid = createGuid();
map1[guid] = 123; // Can with tagged string
var map2 = {};
var serialNo = createSerialNo();
map2[serialNo] = "hello"; // Can index with tagged number
var s1 = "{" + guid + "}";
var s2 = guid.toLowerCase();
var s3 = guid + guid;
var s4 = guid + serialNo;
var s5 = serialNo.toPrecision(0);
var n1 = serialNo * 3;
var n2 = serialNo + serialNo;
var b1 = guid === "";
var b2 = guid === guid;
var b3 = serialNo === 0;
var b4 = serialNo === serialNo;
