const value = 2;
console.log(JSON.stringify([
    `\u0060${value}\u{60}`,
    `\u005C${value}\u{5C}`,
    `\u0024{value} $\u007Bvalue} \u{24}\u{7B}value}`,
    `\u005C\u006E \u005C\u0075${value}`,
    `\u00000 \u00001 \u{0}9 \u0000${value}`,
    `\u0000\u0030 \0\u0031 \x00\u{32} \u0000\x33`,
    `\x41\u8BF7\u{6C42} \x60 \x5C \x24\u007Bvalue} $\x7Bvalue}`,
    `\u0024\x7Bvalue} \x24{value} \u0061\u{0000000000000062}`,
    `\u000A${value}\u000D\u0009\u0008\u000C\u000B`,
    `\u2028${value}\u2029\uFEFF`,
    `\uD800${value}\u{DFFF} \uD800x\uDC00 \uDC00\uD800`,
    `\u{D83D}\u{DE00} \uD83D\uDE00 \u{10FFFF}`,
    `\\u8BF7${value}\\u{6C42}`,
    String.raw`\u8BF7${value}\u{6C42} \uD800 \unicode`,
]));
