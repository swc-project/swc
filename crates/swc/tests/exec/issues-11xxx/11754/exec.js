const SIMPLE_REGEX = /^(?<greeting>hello)\s+(?<name>\w+)$/;
const simpleMatch = "hello world".match(SIMPLE_REGEX);
expect(simpleMatch.groups).toEqual({
    greeting: "hello",
    name: "world",
});

const COMPOSED_REGEX = [
    /^/,
    /(?<tagName>[^[]+)/,
    /(?:\[(?<attrName>[^\]=]+)=\"(?<attrValue>[^\"]+)\"\])?/,
    /$/,
]
    .map((r) => r.source)
    .join("");

const composedMatch = 'w:tag[w:val="test"]'.match(COMPOSED_REGEX);
expect(composedMatch.groups).toEqual({
    tagName: "w:tag",
    attrName: "w:val",
    attrValue: "test",
});

const composedNoAttrMatch = "w:tag".match(COMPOSED_REGEX);
expect(composedNoAttrMatch.groups).toEqual({
    tagName: "w:tag",
    attrName: undefined,
    attrValue: undefined,
});

console.log("ok");
