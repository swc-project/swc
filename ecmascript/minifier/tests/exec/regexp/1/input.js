

function compile(attributePattern, flags) {
    return new RegExp(`(?:^|;)\\s*${attributePattern}\\s*=\\s*` + `(` + `[^";\\s][^;\\s]*` + `|` + `"(?:[^"\\\\]|\\\\"?)+"?` + `)`, flags);
}

console.log(compile("foo", "g"));
console.log(compile("bar", "g"));
console.log(compile("baz", "g"));