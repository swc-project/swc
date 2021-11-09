var Consts1, Consts2;
function getFalsyPrimitive(x) {
    if ("string" === x) return "";
    if ("number" === x) return 0;
    if ("boolean" === x) return !1;
    throw "Invalid value";
}
Consts1 || (Consts1 = {
}), getFalsyPrimitive("string"), getFalsyPrimitive("number"), getFalsyPrimitive("boolean"), Consts2 || (Consts2 = {
}), getFalsyPrimitive("string"), getFalsyPrimitive("number"), getFalsyPrimitive("boolean"), getFalsyPrimitive("string"), getFalsyPrimitive("string"), getFalsyPrimitive("number"), getFalsyPrimitive("string");
