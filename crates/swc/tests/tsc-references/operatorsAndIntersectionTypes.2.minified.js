//// [operatorsAndIntersectionTypes.ts]
function createGuid() {
    return "21EC2020-3AEA-4069-A2DD-08002B30309D";
}
function createSerialNo() {
    return 12345;
}
var map1 = {}, guid = createGuid();
map1[guid] = 123;
var map2 = {}, serialNo = createSerialNo();
map2[serialNo] = "hello";
var s1 = "{" + guid + "}", s2 = guid.toLowerCase(), s3 = guid + guid, s4 = guid + serialNo, s5 = serialNo.toPrecision(0), n1 = 3 * serialNo, n2 = serialNo + serialNo, b1 = "" === guid, b2 = guid == guid, b3 = 0 === serialNo, b4 = serialNo == serialNo;
