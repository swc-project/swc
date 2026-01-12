var CHAR = /*#__PURE__*/ function(CHAR) {
    CHAR[CHAR["	"] = 9] = "	";
    CHAR[CHAR["\n"] = 10] = "\n";
    CHAR[CHAR["\v"] = 11] = "\v";
    CHAR[CHAR["\f"] = 12] = "\f";
    CHAR[CHAR["\r"] = 13] = "\r";
    CHAR[CHAR[" "] = 32] = " ";
    CHAR[CHAR["-"] = 45] = "-";
    CHAR[CHAR["["] = 91] = "[";
    return CHAR;
}(CHAR || {});
var c = "\n";
console.log(c.charCodeAt(0) === 10);
