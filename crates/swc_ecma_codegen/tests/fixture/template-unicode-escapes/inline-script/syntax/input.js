const value = 2;
console.log(JSON.stringify([
    `\u003C/script>${value}`,
    `${value}\u{3c}/ScRiPt >`,
    `\x3c/script\t>${value}\u003c/script/>`,
    `<\u002Fscript>${value}</scr\u0069pt>`,
    `\u003C!--<script>${value}--\u003E`,
    `\u8BF7\u003C/script>\u003C/script>${value}`,
    `\\\u003C/script>${value}\\\u003C!--`,
    `\u003C/scriptx>${value}\u003C/script`,
    `\u003C/script\u000A>${value}\u003C/script>`,
    String.raw`\u003C/script>${value}\u003C!-- --\u003E`,
    "\u003C/script/>\u003C!-- --\u003E",
]));
