function f(x) {
    return [
        `${x}` + "\uD800\uDC00\uDC00\uD800",
        "\uD800\uDC00\uDC00\uD800" + `${x}`,
        `${x}${"\uD800\uDC00\uDC00\uD800"}`,
        `${x}` + "\\uD800\\n\r\n\x00\x01\u2028\u2029",
        `${x}` + "\141\8\9",
        `${x}` + "\
continued",
        `${x}` + "\u003c/script\u003e\u003c!--\u003cscript\u003e--\u003e",
    ];
}
console.log(JSON.stringify(f("a")));
