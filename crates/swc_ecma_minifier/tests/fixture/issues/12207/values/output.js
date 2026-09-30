function f(x) {
    return [
        `${x}𐀀\uDC00\uD800`,
        `𐀀\uDC00\uD800${x}`,
        `${x}𐀀\uDC00\uD800`,
        `${x}\\uD800\\n\r\n\x00  `,
        `${x}a89`,
        `${x}continued`,
        `${x}\x3c/script\x3e\x3c!--\x3cscript\x3e--\x3e`
    ];
}
console.log(JSON.stringify(f("a")));
