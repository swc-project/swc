const directiveHandlers: DirectiveHandlers = {
    TAG(state, _name, ...args: string[]): void {
        const handle = args[0];
        if (!PATTERN_TAG_HANDLE.test(handle)) {
        }
    },
};
