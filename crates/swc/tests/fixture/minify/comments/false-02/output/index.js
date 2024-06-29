var padding = '';
function exec2({ commands }) {
    return __awaiter(this, void 0, void 0, function*() {
        for(let i2 = 0; i2 < commands.length; i2++){
            let command = commands[i2];
            yield(// some-comment
            function({ command }) {
                command();
            }({
                command,
                handleError
            }));
        }
    });
}
export { padding, exec2 };
