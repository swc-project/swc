let missing;
globalThis.values = [() => missing, () => missing, () => missing, () => missing];
globalThis.check = () => missing ? "FAIL" : "PASS";
