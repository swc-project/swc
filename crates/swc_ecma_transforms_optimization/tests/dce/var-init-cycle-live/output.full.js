var AsyncParsePluginContext = class {
    parse(current) {
        return parseAsync(current);
    }
};
async function parseAsync() {
    return new AsyncParsePluginContext();
}
parseAsync();
var registered = register(parseRegistered);
async function parseRegistered() {
    return registered;
}
