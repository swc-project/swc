var _using_ctx = require("@swc/helpers/_/_using_ctx");
class File {
    read() {
        return 'content';
    }
    [Symbol.dispose]() {
        console.log(`closing the file ...`);
    }
}
function main() {
    try {
        var _usingCtx = _using_ctx._();
        const file = _usingCtx.u(new File());
        function readFile() {
            file.read();
        }
        readFile();
    } catch (_) {
        _usingCtx.e = _;
    } finally{
        _usingCtx.d();
    }
}
