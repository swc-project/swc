function hasKind(entity, kind) {
    return entity.kind === kind;
}
let x = {
    kind: "A",
    a: 100
};
hasKind(x, "A"), hasKind(x, "B");
