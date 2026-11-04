const SIMPLE_REGEX = /^(?<greeting>hello)\s+(?<name>\w+)$/;

const COMPOSED_REGEX = [
    /^/,
    /(?<tagName>[^[]+)/,
    /(?:\[(?<attrName>[^\]=]+)=\"(?<attrValue>[^\"]+)\"\])?/,
    /$/,
]
    .map((r) => r.source)
    .join("");

const match1 = "hello world".match(SIMPLE_REGEX);
const match2 = 'w:tag[w:val="test"]'.match(COMPOSED_REGEX);

console.log(match1?.groups, match2?.groups);
