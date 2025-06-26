var _ts_add_disposable_resource = require("@swc/helpers/_/_ts_add_disposable_resource");
var _ts_dispose_resources = require("@swc/helpers/_/_ts_dispose_resources");
class File {
    read() {
        return 'content';
    }
    [Symbol.dispose]() {
        console.log(`closing the file ...`);
    }
}
function main() {
    const env = {
        stack: [],
        error: void 0,
        hasError: false
    };
    try {
        const file = _ts_add_disposable_resource._(env, new File(), false);
        function readFile() {
            file.read();
        }
        readFile();
    } catch (e) {
        env.error = e;
        env.hasError = true;
    } finally{
        _ts_dispose_resources._(env);
    }
}
