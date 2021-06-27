console.log((false || null) ?? "PASS");
console.log(null ?? (true && "PASS"));
console.log((null ?? 0) || "PASS");
console.log(null || (null ?? "PASS"));
