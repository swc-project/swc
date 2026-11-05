function codeUnits(value) {
    return value.split("").map((char) => char.charCodeAt(0).toString(16)).join(",");
}

console.log([
    "\uD800\n",
    "\uDC00\n",
    "\uD83D\uDE00\n",
    "\\uD800\n",
    "\\${value}`\x01\r\n\n",
].map(codeUnits).join("|"));
