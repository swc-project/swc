console.log([
    "\u00e9"["0"] === "\u00e9",
    "\u00e9"["1"] === undefined,
    "\ud83d\ude00"["0"] === "\ud83d",
    "\ud83d\ude00"["1"] === "\ude00",
    "\ud83d\ude00"["2"] === undefined,
    "\ud800"["0"] === "\ud800",
    "\ud800"["1"] === undefined,
].join(","));
