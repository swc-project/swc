var CHAR = /*#__PURE__*/ function(CHAR) {
    CHAR[CHAR["	"] = 0x09] = "	";
    CHAR[CHAR["\n"] = 0x0A] = "\n";
    CHAR[CHAR["\v"] = 0x0B] = "\v";
    CHAR[CHAR["\f"] = 0x0C] = "\f";
    CHAR[CHAR["\r"] = 0x0D] = "\r";
    CHAR[CHAR[" "] = 0x20] = " ";
    CHAR[CHAR["-"] = 0x2D] = "-";
    CHAR[CHAR["["] = 0x5B] = "[";
    return CHAR;
}(CHAR || {});
var c = "\n";
console.log(c.charCodeAt(0) === 0x0A);
