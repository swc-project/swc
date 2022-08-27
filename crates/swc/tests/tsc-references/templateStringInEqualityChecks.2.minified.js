//// [templateStringInEqualityChecks.ts]
"abc" === "abc".concat(0, "abc") || "abc" !== "abc".concat(0, "abc") && "abc0abc" == "abc".concat(0, "abc") && "abc".concat(0, "abc");
