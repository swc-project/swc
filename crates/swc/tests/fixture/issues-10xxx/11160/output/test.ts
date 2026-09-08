var CHAR = /*#__PURE__*/ function(CHAR) {
    CHAR[CHAR["foo"] = 1] = "foo";
    CHAR[CHAR["	"] = 0x09] = "	";
    CHAR[CHAR["\n"] = 0x0A] = "\n";
    CHAR[CHAR["\v"] = 0x0B] = "\v";
    CHAR[CHAR["\f"] = 0x0C] = "\f";
    CHAR[CHAR["\r"] = 0x0D] = "\r";
    return CHAR;
}(CHAR || {});
