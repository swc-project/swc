var AsyncParsePluginContext = class {
    parse(current) {
        return parseAsync(current);
    }
};

async function parseAsync() {
    return new AsyncParsePluginContext();
}
