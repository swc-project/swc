consume(`\n`, `\\2b`, `\x41`, `\u0041`, `\u{1F600}`, `\u{10FFFF}`);
consume(`\u{000000000041}`, `\uD800`, `\uDC00`, `\uD800\uD801`, `\uD800\uDC00`);
consume(`\n${value}\\2b${other}\t`);
consume(`\0\b\f\r\t\v`, `\`\$\\`, `\q`);
consume(`first\
second`);
tag`\unicode`;
