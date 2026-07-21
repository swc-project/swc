console.log([
    "A",
    String.fromCharCode(-1),
    "\x01",
    "\0",
    "\x01",
    "\0",
    String.fromCharCode(1 / 0),
    String.fromCharCode(-1 / 0),
    "A",
    "A"
].map((value)=>value.charCodeAt(0)).join(","));
