//// [templateStringInEqualityChecks.ts]
var x = "abc".concat(0, "abc") === "abc" || "abc" !== "abc".concat(0, "abc") && "abc".concat(0, "abc") == "abc0abc" && "abc0abc" !== "abc".concat(0, "abc");
