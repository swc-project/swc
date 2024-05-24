const one = {
    kind: "Document",
    definitions: [],
    loc: {}
};
const two = {
    kind: "Document",
    definitions: one.definitions,
};

const three = a`${one}`;

export { }