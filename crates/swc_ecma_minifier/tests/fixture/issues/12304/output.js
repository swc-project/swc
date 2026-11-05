function codeUnits(value) {
    return value.split("").map((char)=>char.charCodeAt(0).toString(16)).join(",");
}
console.log([
    `\uD800
`,
    `\uDC00
`,
    `😀
`,
    `\\uD800
`,
    `\\\${value}\`\x01\r

`
].map(codeUnits).join("|"));
