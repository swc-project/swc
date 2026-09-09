const value = Math.random();
enum E {
    template = (`v${value}` as string),
    concatenation = <string>("v" + value),
    nested = `n${value as number}`,
}
if (E[E.template] !== "concatenation" || E[E.nested] !== undefined) {
    throw new Error("Type assertions changed enum reverse mappings");
}
